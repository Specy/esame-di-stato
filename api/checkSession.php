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

    session_start();
    $userId = $_SESSION['userId'];
    if($userId == null){
        echo json_encode(true);
    }else{
        echo json_encode(true);
    }
?>