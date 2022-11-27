const { response } = require('express');
const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

// Fazendo GET para todos os pedidos
// router.get('/', (req, res, next) => {
//     mysql.getConnection((error, conn) => {
//         if(error){return res.status(500).send({error: error})}
//         conn.query(
//             'SELECT * FROM pedidos;',
//             (error, result, fields) => {
//                 conn.release();
//                 if(error){return res.status(500).send({error: error})}
//                 const response = {
//                     quantidade: result.length,
//                     pedidos: result.map(data => {
//                         return {
//                             id_pedido: data.id_pedido,
//                             id_produto: data.id_produto,
//                             quantidade: data.quantidade,
                        
//                         request: {
//                             tipo: 'GET',
//                             descricao: 'Retorna todos os pedidos',
//                             url: 'http://localhost:3000/' + data.id_pedido

//                             }
//                         }
//                     })

//                 }
//                 return res.status(200).send(response);

//             }
//         )
//     })
// });


// Busca os pedidos e os produtos associados

router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){return res.status(500).send({error: error})}
        conn.query(
        `SELECT     pedidos.id_pedido,
                    pedidos.quantidade,
                    produtos.id_produto,
                    produtos.nome,
                    produtos.preco
            FROM pedidos
            INNER JOIN produtos
            ON produtos.id_produto = pedidos.id_produto;`,
            (error, result, fields) => {
                conn.release();
                if(error){return res.status(500).send({error: error})}
                const response = {
                    tamanho: result.length,
                    pedidos: result.map(data => {
                        return {
                            id_pedido: data.id_pedido,
                            quantidade: data.quantidade,
                            produto: {
                                id_produto: data.id_produto,
                                nome: data.nome,
                                preco: data.preco,
                            },
                        }
                    })
                }
                return res.status(200).send(response);

            }
        )
    })
});


// Fazendo o POST para pedido
router.post('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){return res.status(500).send({error: error})}
        conn.query('SELECT * FROM produtos WHERE id_produto = ?',
         [req.body.id_produto],
         (error, result, fields) => {
            if(error){return res.status(500).send({error: error})}
            if(result.length === 0){
                return res.status(404).send({
                     mensagem: "Não foi encontrado produto para  id = " + req.body.id_produto
                    })
            }
            conn.query(
                'INSERT INTO pedidos (quantidade, id_produto) VALUES (?,?);',
                [req.body.quantidade, req.body.id_produto],
                (error, result, fields) => {
                    conn.release();
                    if(error){return res.status(500).send({error: error})}
                    const response = {
                        mesagem: 'Pedido criado com sucesso.',
                        pedidoCriado: {
                            id_pedido: result.id_pedido,
                            quantidade: req.body.quantidade,
                            id_produto: req.body.id_produto,
                            request: {
                                tipo: 'POST',
                                descricao: '',
                                url: 'http://localhost:3000/pedidos'
                            }
    
                        }
                    }
                    return res.status(201).send(response);
    
                })
         })
    })
});
    
// Get para um pedido
router.get('/:id_pedido', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){ return res.status(500).send({error: error})}
        conn.query(
            'SELECT * FROM pedidos WHERE id_pedido = ?;',
            [req.params.id_pedido],
            (error, resultado, field) => {
                if(error){ return res.status(500).send({error: error})}
                if(resultado.length === 0){
                    return res.status(404).send({ mensagem: "Não foi encontrado pedido !" })
                }
                const response = {
                    pedido: {
                        id_pedido: resultado[0].id_pedido,
                        quantidade: resultado[0].quantidade,
                        id_produto: resultado[0].id_produto,
                        request:{
                            tipo: 'GET',
                            descricao: 'Retorna um pedido específico',
                            url: 'http://localhost:3000/produtos' 
                        }
                    }
                }
                return res.status(200).send(response)
            }
        )

    });
})

// Altera um pedido


// Exclui um pedido
router.delete('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){ return res.status(500).send({error: error})}
        conn.query(
            `DELETE FROM pedidos WHERE id_pedido = ?`,
            [req.body.id_pedido],
            (error, resultado, field) => {
                if(error){ return res.status(500).send({error: error})}
                return res.status(202).send({mensagem: 'Pedido excluido!'})
            }
        )

    });
});

module.exports = router;