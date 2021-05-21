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
    function base64_to_jpeg($base64_string, $output_file) {
        $ifp = fopen( $output_file, 'wb' ); 
        $data = explode( ',', $base64_string );
        fwrite( $ifp, base64_decode( $data[ 1 ] ) );
        fclose( $ifp ); 
        return $output_file; 
    }
    $jsonData = json_decode(file_get_contents('php://input'));
    $mysqli = mysqli_connect("localhost", "root", "", "my_specy");
    if (!$mysqli) {
        (new Response('error','error connecting to database'))->send();
    }
    $existsRestaurant = 'SELECT `IDRistorante` FROM `ristoranti` where `nome` = ?';
    if($stmt = $mysqli->prepare($existsRestaurant)){
        $stmt->bind_param('s',$jsonData->name);
        $stmt->execute();
        if($stmt->fetch() !== NULL){
            (new Response('error','Un ristorante con questo nome esiste già'))->send();
        }
        $stmt->close();
    }
    $query = 'INSERT INTO `ristoranti`(`nome`,`via`,`descrizione`,`telefono`,`email`,`password`,`tags`)
            VALUES (?,?,?,?,?,?,?)';
    if($stmt = $mysqli->prepare($query)){
        $stmt->bind_param("sssssss",$jsonData->name,
                                    $jsonData->address,
                                    $jsonData->description,
                                    $jsonData->phoneNumber,
                                    $jsonData->email,
                                    password_hash($jsonData->password,PASSWORD_DEFAULT),
                                    $jsonData->tags);
        $stmt->execute();
        $stmt->close();
    }else{
        (new Response('error','error adding restaurant'))->send();
    }

    
    $getIDQuery = 'SELECT `IDRistorante` from `ristoranti` WHERE `nome`=?';
    $restaurantID = NULL;
    if($stmt = $mysqli->prepare($getIDQuery)){
        $stmt->bind_param('s',$jsonData->name);
        $stmt->execute();
        $stmt->bind_result($restaurantID);
        $stmt->fetch();
        $stmt->close();
    }
    $imgFileName = "ristorante$restaurantID";
    base64_to_jpeg($jsonData->src,"./files/$imgFileName.jpeg");
    $mysqli->query("UPDATE ristoranti SET src='$imgFileName' WHERE IDRistorante = '$restaurantID'");
    foreach($jsonData->categories as $category){
        $categoryQuery = 'INSERT INTO `categorie`(`nome`,`simbolo`,`IDRistorante`) VALUES(?,?,?)';
        if($stmt = $mysqli->prepare($categoryQuery)){
            $stmt->bind_param('ssi',$category->name,$category->emoji,$restaurantID);
            $stmt->execute();
            $stmt->close();
        }else{
            (new Response('error','error adding category '.$category->name))->send();
        }
    }
    foreach($jsonData->foods as $food){

        $category = NULL;
        foreach($jsonData->categories as $loopedCategory) {
            if ($loopedCategory->id == $food->categoryId) {
                $category = $loopedCategory;
                break;
            }
        }
        $storedCategoryIdQuery = 'SELECT IDCategoria from categorie WHERE nome= ? AND IDRistorante = ?';
        $categoryId = NULL;
        if($stmt = $mysqli->prepare($storedCategoryIdQuery)){
            $stmt->bind_param('si',$category->name,$restaurantID);
            $stmt->execute();
            $stmt->bind_result($categoryId);
            $stmt->fetch();
            $stmt->close();
        }
        $foodQuery = 'INSERT INTO `pietanze`(`nome`,`costo`,`descrizione`,`IDRistorante`,`IDCategoria`) VALUES(?,?,?,?,?)';
        if($stmt = $mysqli->prepare($foodQuery)){
            $stmt->bind_param('sdsii',$food->name,
                                        $food->price,
                                        $food->description,
                                        $restaurantID,
                                        $categoryId);
            $stmt->execute();
            $stmt->fetch();
            $stmt->close();
        }
    }       

    (new Response('success','Registrazione effettuata'))->send();
