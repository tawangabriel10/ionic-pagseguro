import { CartaoCredito } from './cartao-credito.model';
import { Dados } from "./dados.model";
import { Pagamento } from './pagamento.model';

export class PagamentoCartaoCredito implements Pagamento{

    public id: number;
    public nome: string;
    public telefone: string;
    public email: string;
    public cpf: string;
    public nascimento: string;
    public logradouro: string;
    public numero: string;
    public bairro: string;
    public cep: string;
    public cidade: string;
    public estado: string;
    public numCard: string;
    public mesValidadeCard: string;
    public anoValidadeCard: string;
    public codSegCard: string;
    public hashComprador: string;
    public bandCard: string;
    public hashCard: string;
    public parcelas: any;

    constructor(dados: Dados, cartaoCredito: CartaoCredito) {
        this.id = dados.id;
        this.nome = dados.nome;
        this.telefone = dados.telefone;
        this.email = dados.email;
        this.cpf = dados.cpf;
        this.nascimento = dados.nascimento;
        this.logradouro = dados.logradouro;
        this.numero = dados.numero;
        this.bairro = dados.bairro;
        this.cep = dados.cep;
        this.cidade = dados.cidade;
        this.estado = dados.estado;
        this.numCard = cartaoCredito.numCard;
        this.mesValidadeCard = cartaoCredito.mesValidadeCard;
        this.anoValidadeCard = cartaoCredito.anoValidadeCard;
        this.codSegCard = cartaoCredito.codSegCard;
        this.hashComprador = cartaoCredito.hashComprador;
        this.bandCard = cartaoCredito.bandCard;
        this.hashCard = cartaoCredito.hashCard;
        this.parcelas = cartaoCredito.parcelas;
    }
}