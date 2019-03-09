import { VarGlobalProvider } from './../var-global/var-global';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Http, RequestOptions, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import xml2js from 'xml2js';
import { DatePipe } from '@angular/common';

declare var PagSeguroDirectPayment: any;

@Injectable()
export class PagseguroPgtoProvider {

  public credencial: Credencial;
  public dados: Dados;

  constructor(
    private datepipe: DatePipe,
    public http: Http,
    private storage: Storage,
    private varGlobais: VarGlobalProvider
  ) {
    
  }

  iniciar(email, token, isSandBox) {
    this.credencial = new Credencial();
    this.dados = new Dados();

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

    }
  }

  private getSession(email, token) {
    return new Promise((resolve) => {
      resolve();
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers});
      let idSession ="";

      this.http.post(this.credencial.urlSession, {}, options)
          .subscribe(data => {
            xml2js.parseSring(data['_body'], function(err, result) {
              idSession = JSON.stringify(result.sessions.id).replace(/[a-zA-Z0-9]/g, '');
            });

            this.credencial.idSession = idSession;
          });
    }).then(() => {
      return Promise.resolve(this.credencial);
    });
  }

  carregaPagSeguraDirectPayment() {
    return new Promise((resolve) => {
      let script: HTMLScriptElement = document.createElement('script');
      script.addEventListener('load', r => resolve());
      script.src = this.credencial.urlPagSeguroDirectPayment;
      document.head.appendChild(script);
    });
  }

  buscarBandeira() {
    PagSeguroDirectPayment.setSessionId(this.credencial.idSession);
    PagSeguroDirectPayment.getBrand({
      cardBin: this.dados.numCard,
      success: response => {
        console.log('numCard', this.credencial.idSession);
        this.dados.bandCard = response.brand.name;
      }
    })
  }

}

export class Credencial {
  key: string;
  urlSession: string;
  urlPagSeguroDirectPayment: string;
  urlTransacao: string;
  idSession: string;
  email: string;
  token: string;
  isSandBox: boolean;
}

export class Dados {
  public id: number;
  public nome: string = 'Tawan Gabriel Queiroz de Souza';
  public telefone: string = '(61) 981384616';
  public email: string = 'tawan.gabriel10@gmail.com';
  public cpf: string = '048.984.911-38';
  public nascimento: string = '29/05/1996';
  public logradouro: 'QNP 36 Conjunto L casa 01';
  public numero: string = '1';
  public bairro: string = 'PSul';
  public cep: string = '72236612';
  public cidade: string = 'Ceilândia';
  public estado: string = 'DF';
  public numCard: string = '4111111111111111';
  public mesValidadeCard: string = '12';
  public anoValidadeCard: string = '2030';
  public codSegCard: string = '123';
  public hashComprador: string;
  public bandCard: string;
  public hashcard: string;
  public parcelas: Array<Object> = [];

  constructor(obj?) {
    Object.assign(this, obj, {}, {});
  }
}
