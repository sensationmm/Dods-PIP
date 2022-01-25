import { CollectionAlert } from './db';

const run = async () => {
    const alert = await CollectionAlert.findByPk(1);
    console.log(alert);
    await alert!.updateQueryExecution();
    await alert!.reload();
    console.log(alert);
};

run();
