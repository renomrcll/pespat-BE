const firebase = require('../database/db');
const firestore = firebase.firestore();
const {reservationsCollectionRef} = require('../database/firebase-collection');
const {paymentsCollectionRef} = require('../database/firebase-collection');

const createPayment = async (req, res) => {
    const id = req.params.id;
    const user_id = req.body.user_id;
    const reservation_id = req.body.reservation_id;
    const payment_method = req.body.payment_method;
    const payment_status = req.body.payment_status;
    const payment_amount = req.body.payment_amount;
    const docRef = paymentsCollectionRef.doc(id);
    let originalData = await docRef.get();

    try {
        if (!id || !user_id || !reservation_id || !payment_method || !payment_status || !payment_amount) {
            throw new Error('Cant create payment without id, user_id, reservation_id, payment_method, payment_status, payment_amount');
        } else {
            originalData = originalData.data();
            user_id = user_id ? user_id : originalData.user_id;
            reservation_id = reservation_id ? reservation_id : originalData.reservation_id;
            payment_method = payment_method ? payment_method : originalData.payment_method;
            payment_status = payment_status ? payment_status : originalData.payment_status;
            payment_amount = payment_amount ? payment_amount : originalData.payment_amount;
        }
        const payment = await docRef.update({ user_id, reservation_id, payment_method, payment_status, payment_amount });
        res.status(200).json({ message: 'Payment created successfully', payment_id: payment.id });
    } catch(error) {
        res.status(409).json({ error: error.message });
    }
}

const updatePayment = async (req, res) => {
    const id = req.params.id;
    const user_id = req.body.user_id;
    const reservation_id = req.body.reservation_id;
    const payment_method = req.body.payment_method;
    const payment_status = req.body.payment_status;
    const payment_amount = req.body.payment_amount;
    const docRef = paymentsCollectionRef.doc(id);
    let originalData = await docRef.get();

    try {

        if (!id) {
            throw new Error('Cant update payment without id');
        } else {
            originalData = originalData.data();
            user_id = user_id ? user_id : originalData.user_id;
            reservation_id = reservation_id ? reservation_id : originalData.reservation_id;
            payment_method = payment_method ? payment_method : originalData.payment_method;
            payment_status = payment_status ? payment_status : originalData.payment_status;
            payment_amount = payment_amount ? payment_amount : originalData.payment_amount;
        }
        const payment = await docRef.update({ user_id, reservation_id, payment_method, payment_status, payment_amount });
    } catch(error) {
        res.status(409).json({ error: error.message });
    }
}


const deletePayment = async (req, res) => {
    try {
        if(!req.params.id) {
            throw new Error('Cant delete payment without id');
        }
        const docRef = paymentsCollectionRef.doc(req.params.id);
        await docRef.delete();
        res.status(200).json({ message: 'payment deleted successfully'});
    } catch(error) {
        res.status(409).json({ error: error.message });
    }

}


const getPayments = async (req, res) => {
    try {
        const payments = await paymentsCollectionRef.get();
        const paymentsArray = payments.docs.map(doc => {
            return {
                id: doc.id,
                ...doc.data()
            }
        });
        res.status(200).json(paymentsArray);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getPaymentById = async (req, res) => {
    try {
        const id = req.params.id;
        const docRef = paymentsCollectionRef.doc(id);
        const payment = await docRef.get();
        res.status(200).json(payment.data());
    } catch (error) {
        res.status(400).send(error.message);
    }
}

module.exports = {
    createPayment,
    updatePayment,
    deletePayment,
    getPayments,
    getPaymentById
}