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
    foreach($jsonData->foods as $food){
        $query = 'INSERT INTO `ordinazioni`(`IDUtente`,`IDPietanza`,`quantità`,`stato`,`IDRistorante`) VALUES (?,?,?,?,?)';
        $status = 's';
        if($stmt = $mysqli->prepare($query)){
            $stmt->bind_param("iiisi",$userId,
                                        $food->id,
                                        $food->quantity,
                                        $status,
                                        $jsonData->restaurantId);
            $stmt->execute();
            $stmt->close();
        }else{
            (new Response('error','error adding restaurant'))->send();
        }
    }
    (new Response('success','Ordine piazzato'))->send();
?>