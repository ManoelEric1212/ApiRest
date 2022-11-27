const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
// Fazendo GET para todos os produtos
router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){ return res.status(500).send({error: error})}
        conn.query(
            'SELECT * FROM produtos;',
            (error, resultado, field) => {
                if(error){ return res.status(500).send({error: error})}
                return res.status(200).send({response: resultado})
            }
        )

    });
});


// Fazendo o POST para produto
router.post('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){ return res.status(500).send({error: error})}
        conn.query(
            'INSERT INTO produtos (nome, preco) VALUES (?,?)',
            [req.body.nome, req.body.preco],
            (error, resultado, field) => {
                conn.release();
                if(error){ return res.status(500).send({error: error})};
                res.status(201).send({
                        mensagem: 'Produto inserido com sucesso !',
                        id_produto: resultado.insertId
                    });
            }
        )
    });
    
});


// Get para um produto
router.get('/:id_produto', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){ return res.status(500).send({error: error})}
        conn.query(
            'SELECT * FROM produtos WHERE id_produto = ?;',
            [req.params.id_produto],
            (error, resultado, field) => {
                if(error){ return res.status(500).send({error: error})}
                return res.status(200).send({response: resultado})
            }
        )

    });
})


// Altera um produto
router.patch('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){ return res.status(500).send({error: error})}
        conn.query(
            `UPDATE produtos
                SET nome =  ?,
                    preco = ?
            WHERE id_produto = ?
            `,
            [req.body.nome, req.body.preco, req.body.id_produto],
            (error, resultado, field) => {
                if(error){ return res.status(500).send({error: error})}
                return res.status(202).send({mensagem: 'produto alterado!'})
            }
        )

    });
});

// Exclui um produto
router.delete('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){ return res.status(500).send({error: error})}
        conn.query(
            `DELETE FROM produtos WHERE id_produto = ?`,
            [req.body.id_produto],
            (error, resultado, field) => {
                if(error){ return res.status(500).send({error: error})}
                return res.status(202).send({mensagem: 'Produto Excluido!'})
            }
        )

    });
});





module.exports = router;