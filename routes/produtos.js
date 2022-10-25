const express = require('express');
const router = express.Router();
// Fazendo GET para todos os produtos

router.get('/', (req, res, next) => {
    res.status(200).send({
        mensagem: 'usando get para rota de produtos'
    })
});
// Fazendo o POST para produto
router.post('/', (req, res, next) => {

    const produto = {
        nome: req.body.nome,
        preco: req.body.preco
    };
    res.status(201).send(
        {
            mensagem: 'usando o Post dentro da rota de produtos',
            produtoCriado: produto
        }
    )
})
// Get para um produto
router.get('/:id_produto', (req, res, next) => {
    const id = req.params.id_produto
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
        mensagem: 'Usando o GET de um produto exclusivo',
        id: id
    })
})
// Altera um produto
router.patch('/', (req, res, next) => {
    res.status(201).send(
        {
            mensagem: 'usando o Patch dentro da rota de produtos'
        }
    )
})

// Exclui um produto
router.delete('/', (req, res, next) => {
    res.status(201).send(
        {
            mensagem: 'usando o DELETE dentro da rota de produtos'
        }
    )
})





module.exports = router;