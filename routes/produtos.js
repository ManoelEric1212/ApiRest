const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;



// Fazendo GET para todos os produtos
router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){ return res.status(500).send({error: error})}
        conn.query(
            'SELECT * FROM produtos;',
            (error, result, field) => {
                if(error){ return res.status(500).send({error: error})}
                const response = {
                    quantidade: result.length,
                    produtos: result.map(prod=>{
                        return {
                            id_produto: prod.id_produto,
                            nome: prod.nome,
                            preco: prod.preco,
                            request:{
                                tipo: 'GET',
                                descricao: '',
                                url: 'http://localhost:3000/produtos/' + prod.id_produto
                            }
                        }

                    })
                }
                // return res.status(200).send({response: resultado})
                return res.status(200).send(response);
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
                const response = {
                    mensagem:'produto inserido com sucesso',
                    produtoCriado: {
                        id_produto: resultado.id_produto,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        request:{
                            tipo: 'POST',
                            descricao: '',
                            url: 'http://localhost:3000/produtos'
                        }
                    }
                }
                res.status(201).send(response);
            });
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
                if(resultado.length === 0){
                    return res.status(404).send({ mensagem: "Não foi encontrado produto !" })
                }
                const response = {
                    produto: {
                        id_produto: resultado[0].id_produto,
                        nome: resultado[0].nome,
                        preco: resultado[0].preco,
                        request:{
                            tipo: 'GET',
                            descricao: 'Retorna um produto específico',
                            url: 'http://localhost:3000/produtos' 
                        }
                    }
                }
                return res.status(200).send(response)
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