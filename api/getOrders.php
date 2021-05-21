<?php
error_reporting(0); 
    class Response{
        var $status;
        var $content;
        function __construct($status, $content){
            $this->status = $status;
            $this->content = $content;
        }
        function encode(){
            return json_encode($this);
        }
        function send(){
            echo $this->encode();
            exit();
        }
    }
    $jsonData = json_decode(file_get_contents('php://input'));
    $mysqli = mysqli_connect("localhost", "root", "", "my_specy");
    session_start();
    $userId = $_SESSION['userId'];
    if($userId == NULL){
        (new Response('error','Non sei loggato'))->send();
    }
    $getOrdersQuery = "SELECT
            pietanze.nome,
            pietanze.costo,
            ordinazioni.quantità,
            categorie.nome,
            ordinazioni.IDRistorante,
            ristoranti.nome
        FROM ordinazioni
        INNER JOIN pietanze ON pietanze.IDPietanza = ordinazioni.IDPietanza
        INNER JOIN categorie ON pietanze.IDCategoria = categorie.IDCategoria
        INNER JOIN ristoranti ON pietanze.IDRistorante = ristoranti.IDRistorante
        WHERE ordinazioni.IDUtente = $userId";
    $orders = array();

    $query = $mysqli->query($getOrdersQuery);
    while($row = $query->fetch_row()){
        $foodObject = (object)[
            'name' => $row[0],
            'price' => intval($row[1]),
            'quantity' => intval($row[2]),
            'categoryName' => $row[3],
            'restaurantId' => intval($row[4]),
            'restaurantName' => $row[5]
        ];
        array_push($orders,$foodObject);

    }
    (new Response('success',$orders))->send();
?>