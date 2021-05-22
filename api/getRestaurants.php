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

    $result = $mysqli->query('SELECT `nome`,`descrizione`,`tags`,`src`,`IDRistorante`,`via` FROM ristoranti');
    $restaurants = array();
    while ($row = $result->fetch_row()) {
        $restaurantObject = (object)[
            'name' => $row[0],
            'description' => $row[1],
            'tags' => $row[2],
            'src' => $row[3],
            'id' => $row[4],
            'address' => $row[5],
            'categories' => array(),
            'foods' => array()
        ];
        $categoriesResult = $mysqli->query("SELECT `IDCategoria`,`simbolo`,`nome` FROM categorie WHERE IDRistorante = $row[4]");
        while($categoryRow = $categoriesResult->fetch_row()){
            array_push($restaurantObject->categories,(object)[
                'id' => intval($categoryRow[0]),
                'emoji' => $categoryRow[1],
                'name' => $categoryRow[2],
            ]);
        }
        $foodsResult = $mysqli->query("SELECT `IDCategoria`,`descrizione`,`nome`,`costo`,`IDPietanza` FROM pietanze WHERE IDRistorante = $row[4]");
        while($foodsRow = $foodsResult->fetch_row()){
            array_push($restaurantObject->foods,(object)[
                'categoryId' => intval($foodsRow[0]),
                'description' => $foodsRow[1],
                'name' => $foodsRow[2],
                'price' => (float)$foodsRow[3],
                'id' => intval($foodsRow[4])
            ]);
        }
        array_push($restaurants,$restaurantObject);
    }
    echo json_encode($restaurants)
?>