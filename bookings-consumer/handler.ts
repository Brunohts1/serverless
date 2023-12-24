import { unmarshall } from '@aws-sdk/util-dynamodb';
import * as moment from 'moment';
import { SNSClient, PublishCommand, PublishCommandOutput } from "@aws-sdk/client-sns";

const client = new SNSClient({});

export const listen = async (
    event: any
    ): Promise<any> => {
    moment.locale('pt-br');
    const snsPromises: Promise<PublishCommandOutput>[] = [];

    for (const record of event.Records) {
        if (record.eventName === 'INSERT') {
            const booking = unmarshall(record.dynamodb.NewImage);
            console.log(`O usuário ${booking.user.name} (${booking.user.email}) realizou uma reserva em: ${moment(Number(booking.date)).format('LLLL')}`);
            snsPromises.push(client.send(new PublishCommand ({
                TopicArn: process.env.SNS_NOTIFICATIONS_TOPIC,
                Message: `O usuário ${booking.user.name} (${booking.user.email}) realizou uma reserva em: ${moment(Number(booking.date)).format('LLLL')}`
            })));
        }
    };
    await Promise.all(snsPromises);
    console.log('Enviado com sucesso');
 }

