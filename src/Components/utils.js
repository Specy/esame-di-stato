
class RestaurantPreviewCard{
    constructor(name,tags,imgSrc,description,foods,categories,address,phoneNumber){
        this.name = name || "Ristorante" + random()
        this.tags = tags || ["Pizza","Pub"]
        this.src = imgSrc || "https://images.unsplash.com/photo-1594179047502-07fb8a5451f6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80"
        this.address = address || "Test address"
        this.description = description ||"Descrizione ristorante"
        this.menu = new Menu(exampleMenu)
        this.phoneNumber = phoneNumber || "123456789"
    }
}
function random(){
    return Math.floor(Math.random() *100)
}
let exampleMenu ={
    categories:[
        {id:0, name:'Pizza'},
        {id:1, name:'Pasta'},
        {id:2, name:'Panini'}
    ],
    foods:[{
            categoryId: 0,
            name: "Margherita",
            description: "Description",
            id:0,
            price: 1
        },{
            categoryId: 0,
            name: "Patate",
            description: "Description",
            id:1,
            price: 1.2
        },{
            categoryId: 0,
            name: "Ventricina",
            description: "Description",
            id:2,
            price: 1.1
        },{
            categoryId: 1,
            name: "Carbonara",
            description: "Description",
            id:3,
            price: 3
        },{
            categoryId: 2,
            name: "Americano",
            description: "Description",
            id:4,
            price: 3
        },{
            categoryId: 2,
            name: "Bufalo",
            description: "Description",
            id:5,
            price: 3.5
        }
    ]
}

class Menu{
    constructor(menu){
        this.table = [
            ...menu.categories.map(category => ({
                categoryName: category.name,
                categoryId: category.id,
                foods: menu.foods.filter(food => food.categoryId === category.id)
            }))
        ]
    }
}
class Food{
    constructor(name,category,description,price){
        this.name = name || "Test food"
        this.categoryId = category || "Test Category"
        this.description = description || "Test description"
        this.price = price || 0
    }
}
export {
    RestaurantPreviewCard,
    Menu
}