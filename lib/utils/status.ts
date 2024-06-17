export default function getStatus(status:string){
    const dict: {[key: string]: string} = {
        payed: 'Pagado',
        onTime: 'A tiempo',
        due: 'Vencido',
        pending: 'En revisión'
    }
    return dict[status];
    
}