const express = require('express');
const router = express.Router();
// Fazendo GET para todos os pedidos

router.get('/', (req, res, next) => {
    res.status(200).send({
        mensagem: 'usando get para rota de pedidos'
    })
});
// Fazendo o POST para pedido
router.post('/', (req, res, next) => {
    res.status(201).send(
        {
            mensagem: 'usando o Post dentro da rota de pedidos'
        }
    )
})
// Get para um pedido
router.get('/:id_pedido', (req, res, next) => {
    const id = req.params.id_pedido
    if (id === 'epecial') {
        res.status(200).send({
            mensagem: 'teste de id especial',
            id: id
        })
    } else {
        res.status(200).send({
            mensagem: 'Você passou um id'
        })
    }
    res.status(200).send({
        mensagem: 'Usando o GET de um pedido exclusivo',
        id: id
    })
})
// // Altera um pedido
// router.patch('/', (req, res, next) => {
//     res.status(201).send(
//         {
//             mensagem: 'usando o Patch dentro da rota de pedidos'
//         }
//     )
// })

// Exlui um pedido
router.delete('/', (req, res, next) => {
    res.status(201).send(
        {
            mensagem: 'usando o DELETE dentro da rota de pedidos'
        }
    )
})

module.exports = router;