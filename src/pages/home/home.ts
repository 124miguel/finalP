import { Component } from '@angular/core';
import { NavController, LoadingController, NavParams, AlertController } from 'ionic-angular';
import { AngularFire, AuthProviders, AuthMethods, FirebaseListObservable } from 'angularfire2';
import { AuthProvider } from '../../providers/auth';
import { AuthPage } from '../auth/home/home';
import 'rxjs/add/operator/debounceTime';
import { FormControl } from '@angular/forms';
import { ItemDetailsPage } from '../item-details/item-details';
//import { SalidaPage } from '../salida/salida';
@Component({
  templateUrl: 'home.html',
  selector: 'home',
})

export class HomePage {
   error: any;
  form: any;
  mike: any;
  
  searchTerm: string = '';
	searchControl: FormControl;
	items_busqueda: any;
  searching: any = false;
   art_totales2: FirebaseListObservable<any[]>;
   art_totales : any;
   art_tot2: any;
   mike_usuarios: FirebaseListObservable<any[]>;
   aux: FirebaseListObservable<any[]>;
   mike_cate: any;
   mike_email: any;
   postID: any;
  //variable para carousel
  art_c : any;
  //vals para filtro
  testcheckboxOpen = false;
  testcheckboxResult;
  fecha: String = new Date().toISOString();
  icons: string[];
  items: Array<{title: string, note: string, icon: string}>;
  articulos: Array<{titulo: string, categoria: number, escirtorid: string,
  escrito : string ,tipo: number, key: string}>;
  preserveSnapshot: true;
  constructor(private navCtrl: NavController, private af: AngularFire, private auth: AuthProvider,
  private loadingCtrl: LoadingController, public navParams: NavParams, public alertCtrl: AlertController) {
    this.searchControl = new FormControl();
    this.art_c=[];

  this.mike = this.af.auth.getAuth().auth.uid;
  this.mike_email = this.af.auth.getAuth().auth.email;;



////MIKE
   ///Aqui es donde debe de ir la consulta a la base de datos con estos campos
   //solo  debe de contener esto y ya
      /*  this.art_totales=[
      {titulo: 'dsada', categoria: 1, escirtorid: 1,escrito : 'dsadas'},
      {titulo: 'iyqwoyrouwq', categoria: 1, escirtorid: 1,escrito : 'afsaji9'},
      {titulo: 'popoe', categoria: 2, escirtorid: 1,escrito : 'skjdalsj'}
        ];*/
        this.art_tot2=[];
        this.art_totales2 = this.af.database.list('/articulos');
        this.aux = this.af.database.list('/articulos');
        this.mike_usuarios = this.af.database.list('/user');
        
       this.art_totales2.subscribe(items => {
          this.art_tot2=[];
    // items is an array
    items.forEach(item => {
        console.log('Item:', item.categoria);
            this.art_tot2.push({
              titulo: item.titulo,
               categoria: item.categoria, 
               escirtorid: item.escirtorid, 
               escrito : item.escrito,
               tipo: item.tipo,
               key: item.key}); 
 
          });
          


// console.log('tot',this.art_tot2);
  //       console.log(this.art_totales, this.art_tot2);
         this.art_totales = this.art_tot2; 
       //S this.art_totales.subscribe.toString;
   for(let i = 1; i < 4; i++) {
      this.art_c.push( this.art_totales[Math.floor(Math.random() * this.art_totales.length)]
      );
    }
    

     this.articulos = this.art_totales;
      });

      this.mike_usuarios.subscribe(items2 => {
    items2.forEach(item2 => {
        console.log('mike2.5 :', item2.categoria, item2.email, this.mike_email, this.mike);
        if  (this.mike_email == item2.email){
          this.mike_cate = item2.categoria;
          console.log("correo actual"+this.mike_email+"Correo item "+item2.email+this.mike_cate);
        }
          
          });
        
      }); 

        
    
    this.icons = ['flask', 'wifi', 'beer', 'football', 'basketball', 'paper-plane',
    'american-football', 'boat', 'bluetooth', 'build'];

  }
 
  iconoCat(dat){
    var sdato ="";
    sdato = this.icons[dat];
    return sdato;
  }

  itemTapped(event, articulo) {
    
    this.navCtrl.push(ItemDetailsPage
    , {
    item: articulo
  });
  }

  ionViewDidLoad() {

	    this.setFilteredItems();

	    this.searchControl.valueChanges.debounceTime(700).subscribe(search => {

	    	this.searching = false;
	    	this.setFilteredItems();
	      
	    });


}
  filterItems(searchTerm){
    
	    return this.articulos.filter((articulos) => {
	    	return articulos.titulo.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
	    });	
    }	
    	onSearchInput(){
        console.log("hjashd");
        this.setFilteredItems();
		this.searching = true;
	}

	setFilteredItems() {
		this.items_busqueda = this.filterItems(this.searchTerm);
    if(this.items_busqueda.length>0){
    this.articulos =this.items_busqueda;}
    else{
      
      this.articulos = this.art_totales;
      let alert = this.alertCtrl.create({
        title: 'Busqueda',
        subTitle: 'el titulo que buscas no esta disponible',
        buttons: ['Dismiss']
      });
      alert.present();
    }
  }
 opcionCategoria(){
    
    let alert = this.alertCtrl.create();
    
    alert.setTitle('Selecciona tu categoria');

    alert.addInput({
      type: 'checkbox',
      label: 'Checkbox 1',
      value: '1',
      //checked: true
    });

    alert.addInput({
      type: 'checkbox',
      label: 'Checkbox 2',
      value: '2',
      //checked: true
    });
    
    alert.addInput({
      type: 'checkbox',
      label: 'Checkbox 3',
      value: '3',
      //checked: true
    });
    
    alert.addButton('Cancel');

    alert.addButton({
      text: 'Ok',
      handler: data => {
        console.log('Radio:', data);
        this.testcheckboxOpen = false;
        this.testcheckboxResult = data;
        this.filtroCat(data);
      }
    });

    alert.present().then ( () => {
      this.testcheckboxOpen = true;
    });

}
filtroCat(categoriaData){
  this.articulos = [];
  for(var i =0; i < this.art_totales.length ; i++){
    for(var j =0; j < this.art_totales.length ; j++){
      if(this.art_totales[i].categoria == categoriaData[j]){
        this.articulos.push(this.art_totales[i]);
      }
    }

  }
  console.log('res: ',this.articulos);
}

/////Mike este se debe utilizar para postear
//solo debe aparecer cuando este loggeado
//el boton en la pagina html no debe aparecer al usuario comun
//o si prefieres puedes decirle que necesita logearse para realizar la accion 
///en el if eso esta a tu consideracion
presentPrompt() {
  let alert = this.alertCtrl.create({
    title: 'insertar articulo',
    inputs: [
      {
        name: 'titulo',
        placeholder: 'titulo',
        type: 'text'
      },
      {
        name: 'escrito',
        placeholder: 'Escrito',
        type: 'text'
      },
       {
        name: 'categoria',
        placeholder: 'categoria 1: 2: 3: 4:',
        type: 'number'
      },  {
        name: 'tipo',
        placeholder: 'tipo 1: 2: 3: 4:',
        type: 'number'
      }
    ],
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        handler: dataP => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Publicar',
        handler: dataP => {
          //Aqui puedes verificar el login y con esa misma varible 
          //ponerla en escritorid
          if (1 == 1) {
            // logged in!
            //esto es un ejemplo de lo que debes de mandar con firebase
            //mas o menos es la misma sintaxis pero con el objeto de firebase
            /*this.art_totales.push({
              ///en escritor debe ir el id del usuario 
              //si puedes agrega una funcion qugee te regrese el nombre del usuario
              //con su id
              titulo: dataP.titulo, categoria: dataP.categoria, escirtorid: 1,escrito : dataP.escrito
            });*/
            //this.articulos = this.art_totales;
          
            
            var newPostRef = this.art_totales2.push({titulo: dataP.titulo, categoria: dataP.categoria, escirtorid: this.mike, escrito : dataP.escrito, tipo : dataP.tipo, key: "hola"});
            this.postID = newPostRef.key;
            console.log(this.postID);
            this.updatekey(this.postID);
      } else {
            // invalid login
            return false;
          }
        }
      }
    ]
  });
  alert.present();
}
 addSong(){
  let prompt = this.alertCtrl.create({
    title: 'Song Name',
    message: "Enter a name for this new song you're so keen on adding",
    inputs: [
      {
        name: 'title',
        placeholder: 'Title'
      },
    ],
    buttons: [
      {
        text: 'Cancel',
        handler: data => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Save',
        handler: data => {
          this.art_totales2.push({
            title: data.title
          });
        }
      }
    ]
  });
  prompt.present();
}
mostrar(artid){
   if(this.mike == artid.escirtorid && this.mike_cate == 2){
     return 1;
   }else if(this.mike_cate == 5){
     return 1;
   }
   else{
    return 0;
   }
 }
 mostrar2(){
    if(this.mike_cate == 2 || this.mike_cate == 5){
      return 1;
    }
    else {
      return 0;
    }
 }

 mostrar43(artid){

   switch (this.mike_cate) {
            case "1":
                if(this.mike_cate == artid.tipo){
                  return 1;
                }else{
                  return 0;
                }
            case "2" :
                if(this.mike_cate == artid.tipo || artid.tipo == 1){
                  return 1;
                }else{
                  return 0;
                }
                
            case "3":
                if(this.mike_cate == artid.tipo || artid.tipo == 1){
                  return 1;
                }else{
                  return 0;
                }
            case "4":
                if(this.mike_cate == artid.tipo || artid.tipo == 1){
                  return 1;
                }else{
                  return 0;
                }
            case "5":
                if(this.mike_cate != 0){
                  return 1;
                }else{
                  return 0;
                }
            

        }
   
 }
 eliminar(articulo){
   console.log("se elimino",articulo.key);
   this.art_totales2.remove(articulo.key);
}
updatekey(keym){
this.art_totales2.update(keym,{
							key: keym
						});          
}
  logout() {
    let loading = this.loadingCtrl.create({
      content: 'Espera por favor...'
    });
    loading.present();
    this.af.auth.logout();
    this.auth.logout;
    this.af.auth.logout();
      setTimeout(() => {
        loading.dismiss();
        this.navCtrl.setRoot(AuthPage);
      }, 1000);
    }
  }

