import { CartaoCredito } from './../models/cartao-credito.model';
import { Credencial } from './../models/credencial.model';
import { Dados } from './../models/dados.model';

export class QueryStringUtil {
    public static montaQryStr(dados:Dados, cartaoCredito: CartaoCredito, credencial: Credencial) {
        let url: string = ''+
        'email='+credencial.email+
        '&token='+credencial.token+
        '&paymentMode=default'+
        '&paymentMethod=creditCard'+
        '&receiverEmail=suporte@loja.com.br'+
        '&currency=BRL'+ 
        '&extraAmount=1.00'+    /* <= especializar */  
        '&itemId1=0001'+ /* <= especializar */ 
        '&itemDescription1=Notebook Prata'+ /* <= especializar */ 
        '&itemAmount1=24300.00'+ /* <= especializar */ 
        '&itemQuantity1=1'+
        '&notificationURL=https://sualoja.com.br/notifica.html'+
        '&reference=REF1234'+
        '&senderName=Jose Comprador'+
        '&senderCPF='+dados.cpf+
        '&senderAreaCode=11'
        '&senderPhone='+dados.telefone+
        '&senderEmail='+dados.email+
        '&senderHash='+cartaoCredito.hashComprador+
        '&shippingAddressStreet='+dados.logradouro+
        '&shippingAddressNumber='+dados.numero+
        '&shippingAddressComplement=nd'+ /* <= especializar */ 
        '&shippingAddressDistrict='+dados.bairro+
        '&shippingAddressPostalCode='+dados.cep+
        '&shippingAddressCity='+dados.cidade+
        '&shippingAddressState='+dados.estado+
        '&shippingAddressCountry=BRA'+
        '&shippingType=1'+
        '&shippingCost=1.00'+
        '&creditCardToken='+cartaoCredito.hashCard+
        '&installmentQuantity=5'+ /* <= especializar */ 
        '&installmentValue=125.22'+ /* <= especializar */ 
        '&noInterestInstallmentQuantity=2'+ /* <= especializar */ 
        '&creditCardHolderName='+dados.nome+ /* <= especializar */ 
        '&creditCardHolderCPF='+dados.cpf+ /* <= especializar */ 
        '&creditCardHolderBirthDate=27/10/1987'+ /* <= especializar */ 
        '&creditCardHolderAreaCode=11'+ /* <= especializar */ 
        '&creditCardHolderPhone=56273440'+ /* <= especializar */ 
        '&billingAddressNumber=13840'+ /* <= especializar */ 
        '&billingAddressComplement=5o andar'+ /* <= especializar */
        '&billingAddressDistrict=Jardim Paulistano'+ /* <= especializar */
        '&billingAddressPostalCode=01452002'+ /* <= especializar */
        '&billingAddressCity=Sao Paulo'+ /* <= especializar */
        '&billingAddressState=SP'+ /* <= especializar */
        '&billingAddressCountry=BRA'; /* <= especializar */      
        return url;
      }  
}