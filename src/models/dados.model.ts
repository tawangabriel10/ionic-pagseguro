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
  
    constructor(obj?) {
      Object.assign(this, obj, {}, {});
    }
  }