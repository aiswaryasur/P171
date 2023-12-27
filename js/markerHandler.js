var userId = null

AFRAME.registerComponent('marker-handler',{
    init:async function(){
        if(userId === null){
            this.askUserId()
        }
        var toys = await this.getToys()
        this.el.addEventListener('markerFound',()=>{
            if(userId!== null){
                var markerId = this.el.id
            
            console.log('Marker-is-found')
            this.handlerMarkerFound(toys,markerId)
            }
        });

        this.el.addEventListener('markerLost',()=>{
            console.log('Marker-is-Lost')
            this.handleMarkerLost()
        })
    },
    getToys: async function(){
        return await firebase.firestore().collection('toys').get().then(
            snapshot=>{
                return snapshot.docs.map(doc=>{doc.data})
            }
        )
    },

    askUserId: function(){
        var url = 'https://raw.githubusercontent.com/whitehatjr/ar-toy-store-assets/master/toy-shop.png'
        swal({
            title:'Wecome To Toy Shop!!!',
            icon: url,
            content:{
                element:'input',
                attributes:{
                    placeHolder:'type your uid Ex:( U01 )',
                    type:'number',
                    min:1,
                }
            },
            closeOnClickOutside:false

        })
        .then((inputValue)=>{
            userId = inputValue

        })
    },


    handlerMarkerFound:function(toys,markerId){
        var toy = toys.filter(toy=>toy.id===markerId)[0] 
        if(toy.is_out_of_stock.includes(true)){
            swal({
                icon:'warning',
                title:toy.toy_name.toUpperCase(),
                text:'this toy is in out of stock !',
                timer:2500,
                buttons:false
            })
        }
        else{
            var model= document.querySelector(`#model-${toy.id}`)
        }
        var button = document.getElementById('button-div');
        button.style.display = 'flex'

        var orderButton = document.getElementById('order-button')
        var ratingButton = document.getElementById('order-summary')

        orderButton.addEventListener('click',function(){
            swal({
                icon:'success',
                title : 'THANKS FOR ORDER!',
                text:'Your order will be delivered soon to your house'
            })
        })

        ratingButton.addEventListener('click',function(){
            swal({
                icon:'warning',
                title : 'ORDER SUMMARY',
                text:'Work in progress'
            })
        })
    },

    handleMarkerLost:function(){
        var button = document.getElementById('button-div');
        button.style.display = 'none'
    }
})