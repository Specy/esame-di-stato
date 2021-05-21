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
$passwordQuery = 'SELECT `password`,`nome`,`IDRistorante` FROM `ristoranti` WHERE `email` = ?';
$restaurantId;
$passwordHash = NULL;
$restaurantName = NULL;
if($stmt = $mysqli->prepare($passwordQuery)){
    $stmt->bind_param('s',$jsonData->email);
    $stmt->execute();
    $stmt->bind_result($passwordHash,$restaurantName,$restaurantId);
    $stmt->fetch();
    $stmt->close();
}
if($passwordHash === NULL){
    (new Response('error','Credenziali sbagliate'))->send();
}
if(password_verify($jsonData->password,$passwordHash)){
    $ordersQuery = "SELECT
                        pietanze.nome,
                        pietanze.costo,
                        ordinazioni.quantità,
                        CONCAT(utenti.nome,' ', utenti.cognome),
                        utenti.via,
                        utenti.telefono,
                        utenti.IDUtente
                    FROM ordinazioni
                    INNER JOIN pietanze ON pietanze.IDPietanza = ordinazioni.IDPietanza
                    INNER JOIN categorie ON pietanze.IDCategoria = categorie.IDCategoria
                    INNER JOIN utenti ON utenti.IDUtente = ordinazioni.IDUtente
                    WHERE ordinazioni.IDRistorante = $restaurantId";
    $query = $mysqli->query($ordersQuery);
    $orders = array();
    while($row = $query->fetch_row()){
        $order = (object)[
            'name' => $row[0],
            'price' => $row[1],
            'quantity' => $row[2],
            'user' => $row[3],
            'userAddress' => $row[4],
            'userPhone' => $row[5],
            'userId' => $row[6]
        ];
        array_push($orders,$order);
    }
    (new Response('success',(object)[
        'orders' =>$orders,
        'restaurantName' => $restaurantName
    ]))->send();
}else{
    (new Response('error','Credenziali sbagliate'))->send();
}

?>