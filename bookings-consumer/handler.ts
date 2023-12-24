import { unmarshall } from '@aws-sdk/util-dynamodb';
import * as moment from 'moment'

export const listen = async (
    event: any
    ): Promise<any> => {
    moment.locale('pt-br');

    for (const record of event.Records) {
        if (record.eventName === 'INSERT') {
            const booking = unmarshall(record.dynamodb.NewImage);
            console.log(booking);
            console.log(`O usuário ${booking.user.name} (${booking.user.email}) realizou uma reserva em: ${moment(Number(booking.date)).format('LLLL')}`);
        }
    }  
    return { message: 'retorno da lambda' };
 }

