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
    $passwordQuery = 'SELECT `password`,`IDUtente`,`nome` FROM `utenti` WHERE `email` = ?';
    $passwordHash = NULL;
    $userId = NULL;
    $userName = NULL;
    if($stmt = $mysqli->prepare($passwordQuery)){
        $stmt->bind_param('s',$jsonData->email);
        $stmt->execute();
        $stmt->bind_result($passwordHash,$userId,$userName);
        $stmt->fetch();
        $stmt->close();
    }
    if($passwordHash === NULL){
        (new Response('error','Credenziali sbagliate'))->send();
    }
    if(password_verify($jsonData->password,$passwordHash)){
        ini_set('session.cookie_lifetime', 60 * 60 * 24 * 30);
        session_start();
        $_SESSION['userId'] = $userId;
        (new Response('success',(object)[
            'name' => $userName
        ]))->send();
    }else{
        (new Response('error','Credenziali sbagliate'))->send();
    }
?>