import { CartaoCredito } from './../models/cartao-credito.model';
import { VarGlobalService } from './var-global.service';
import { QueryStringUtil } from '../utils/query-string.util';
import { Dados } from '../models/dados.model';
import { Credencial } from '../models/credencial.model';

import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Http, RequestOptions, Headers, Response} from '@angular/http';
import 'rxjs/add/operator/map';
import xml2js from 'xml2js';
import { DatePipe } from '@angular/common';
import { PagamentoCartaoCredito } from '../models/pagamento-cartao-credito.model';
import { Pagamento } from '../models/pagamento.model';

declare var PagSeguroDirectPayment: any;

@Injectable()
export class PagseguroPgtoService {

  public credencial: Credencial;

  constructor(
    private datepipe: DatePipe,
    public http: Http,
    private storage: Storage,
    private varGlobais: VarGlobalService
  ) {
    
  }

  iniciar(email, token, isSandBox) {
    this.credencial = new Credencial();

    if (isSandBox) {
      this.credencial.urlSession = "https://ws.sandbox.pagseguro.uol.com.br/v2/sessions?email=" + email + "&token=" + token;
      this.credencial.urlPagSeguroDirectPayment = "https://stc.sandbox.pagseguro.uol.com.br/pagseguro/api/v2/checkout/pagseguro.directpayment.js";
      this.credencial.urlTransacao = 'https://ws.sandbox.pagseguro.uol.com.br/v2/transactions/';
    } else {
      this.credencial.urlSession = "https://pagseguro.uol.com.br/v2/sessions?email=" + email + "&token=" + token;
      this.credencial.urlPagSeguroDirectPayment = "https://stc.pagseguro.uol.com.br/pagseguro/api/v2/checkout/pagseguro.directpayment.js";
      this.credencial.urlTransacao = 'https://ws.pagseguro.uol.com.br/v2/transactions/';
    }

    this.credencial.key = this.datepipe.transform(new Date(), 'ddMMyyyyHHmmss');
    this.credencial.email = email;
    this.credencial.token = token;
    this.credencial.isSandBox = isSandBox;

    if (!this.varGlobais.getStatusScript()) {
      this.getSession(email, token).then(() => {
        this.carregaPagSeguroDirectPayment().then(() => {
          PagSeguroDirectPayment.setSessionId(this.credencial.idSession);
          this.storage.set('credencial', this.credencial);
          console.log(PagSeguroDirectPayment);
        });
      });
    }
  }

  private getSession(email, token) {
    return new Promise((resolve) => {
      resolve();
      let headers = new Headers({ 'Content-Type': 'application/xml;charset=ISO-8859-1' });
      let options = new RequestOptions({ headers: headers});
      let idSession ="";

      this.http.post(this.credencial.urlSession, {}, options)
          .subscribe((resp: Response) => {
            console.log(resp);
     /*      xml2js.parseString(resp['_body'], function(err, result) {
              console.log('Parse', result);
              idSession = JSON.stringify(result.sessions.id).replace(/[a-zA-Z0-9]/g, '');
            });   /* 
 */
            this.credencial.idSession = 'd0fdfe733ba64c04aaab2e7931a11141';//idSession;
            
            PagSeguroDirectPayment.setSessionId(this.credencial.idSession);
          });
    }).then(() => {
      return Promise.resolve(this.credencial);
    });
  }

  private carregaPagSeguroDirectPayment(): Promise<void> {
    return new Promise((resolve) => {
      let script: HTMLScriptElement = document.createElement('script');
      script.addEventListener('load', r => resolve());
      script.src = this.credencial.urlPagSeguroDirectPayment;
      document.head.appendChild(script);
    });
  }

  buscaBandeira(cartaoCredito: CartaoCredito): Promise<CartaoCredito> {
    return new Promise((resolve, reject) => {
      PagSeguroDirectPayment.getBrand({
        cardBin: cartaoCredito.numCard,
        success: response => {
          cartaoCredito.bandCard = response.brand.name;
          console.log('Bandeira Cartão', response);
          resolve(cartaoCredito);
        }, error: error => {
          reject(error);
        }
      });
    });
  }

  buscaParcelas(cartaoCredito: CartaoCredito): Promise<CartaoCredito> {
    return new Promise((resolve, reject) => {
      PagSeguroDirectPayment.getInstallments({
        amount: '100',
        brand: cartaoCredito.bandCard,
        maxInstallmentNoInterest: 3,
        success: response => {
          cartaoCredito.parcelas = response.installments[cartaoCredito.bandCard];
          console.log('buscaParcelas', response);
          resolve(cartaoCredito);
        },
        error: error => {
          console.log('ErrorBuscaParcela', error);
          reject(error);
        }
      });
    });
  }

  buscaMeiosPagamento(preco: number): Promise<any> {
    return new Promise((resolve, reject) => {
      PagSeguroDirectPayment.getPaymentMethods({
        amount: preco,
        success: response => {
          console.log('Meios Pagamento', response);
          resolve(response.paymentMethods);
        },
        error: error => {
          reject(error);
        }
      });
    });
  }

  pagarCartaoCredito(dados: Dados, cartaoCredito: CartaoCredito) {
    cartaoCredito.hashComprador = PagSeguroDirectPayment.getSenderHash();

    PagSeguroDirectPayment.createCardToken({
      cardNumber: cartaoCredito.numCard,
      cvv: cartaoCredito.codSegCard,
      expirationMonth: cartaoCredito.mesValidadeCard,
      expirationYear: cartaoCredito.anoValidadeCard,
      brand: cartaoCredito.bandCard,
      success: response => {
        cartaoCredito.hashCard = response.card.token;
        console.log(dados);

        let pagamento: Pagamento = new PagamentoCartaoCredito(dados, cartaoCredito);

        this.enviarDadosServidor(pagamento);
      }, 
      error: response => {
        console.log('Error Pagar', response);
      }
    });
  }

  enviarDadosServidor(dados: Pagamento) {
    this.pagarCheckoutTransparente(dados)
        .subscribe(result => console.log('Resultado', result));
  }

  pagarCheckoutTransparente(dados: Pagamento) {
    let headers: Headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded; charset=ISO-8859-1'
    });
    let options: RequestOptions = new RequestOptions({ headers: headers });

    let url: string = this.credencial.urlTransacao;
    let body: string = JSON.stringify({dados});
    return this.http.post(url, body, options).map(res => res.json());
  }

}




