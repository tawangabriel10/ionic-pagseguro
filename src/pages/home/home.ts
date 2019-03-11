import { CartaoCredito } from './../../models/cartao-credito.model';
import { Dados } from './../../models/dados.model';
import { Credencial } from './../../models/credencial.model';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { PagseguroPgtoService } from '../../providers/pagseguro-pgto.service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  dados: Dados;
  cartaoCredito: CartaoCredito;

  constructor(
    public navCtrl: NavController,
    public pagSeguroService: PagseguroPgtoService
  ) {
    this.dados = new Dados();

    pagSeguroService.iniciar('tawan.gabriel10@gmail.com', 'ACE7A350820D4B4997F0E33526D2B34A', true);
  }

  enviarOrdem() {
    this.pagSeguroService.pagarCartaoCredito(this.dados, this.cartaoCredito);
  }

}
