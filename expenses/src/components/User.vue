<template>
 <v-main class="grey lighten-3">
      <v-container>
        <v-row>
          <v-col
            cols="12"
            sm="3"
          >
          
            <v-card
              rounded="lg"
              min-height="268"
              elevation="5"
            >
                <v-img
                rounded="lg"
                :src="`${userInfos.picUrl}`"
                ></v-img>
              <!--  -->
          <v-card-text>
            <h3>{{userInfos.userLastName + " " + userInfos.userFirstName}}</h3>
            <div>
            <a :href="`mailto:${userInfos.userEmail}`"> {{userInfos.userEmail}}</a><br>
            {{userInfos.userAddress}}<br>
            {{userInfos.userPhoneNumber}}
            </div>
          </v-card-text>
               
            </v-card>
            
            <v-spacer></v-spacer>
            <v-flex class="pa-2" >
              <SkillFormPopup v-bind:idUser="userInfos._id" class="pa-2" v-show="isAdmin"/>
              <ProjectFormPopup v-bind:idUser="userInfos._id" class="pa-2" v-show="isAdmin"/>
              <PictureForm v-bind:idUser="userInfos._id" class="pa-2" v-show="isAdmin"/>
              <LinkForm v-bind:idUser="userInfos._id" class="pa-2" v-show="isAdmin"/>
               
              <v-layout justify-center>
                <v-btn
                color="red"
                dark
                v-on:click="logout"
                v-show="isAdmin"
                width="80%"
              >
                Se déconnecter
              </v-btn>
                <v-btn
                color="red"
                dark
                href="/"
                v-show="!isAdmin"
                width="80%"
              >
                Quitter
              </v-btn>
</v-layout>
            
            </v-flex>
          </v-col>

          <v-col
            cols="12"
            sm="7"       
          >
          <Pmap v-if = "carte" v-bind:pos ="this.userInfos.userAddress" class="pa-2" />
          <!-- <v-container > -->
        <v-row>
            <v-col cols="0">
              <v-card outlined tile elevation="5" height="100%">
              <v-card-text>
          <h2>Liste des competences</h2>
            <ul v-for="skill in this.skillListe" :key="skill.id">
              <li>{{skill.skillName}}</li>
            </ul>
        </v-card-text>
            </v-card>
            
            </v-col>
        </v-row>
            <v-row>
          <v-col
            v-for="proj in userProjects"
            :key="proj.id"
            cols="6"
            rounded="lg"
          >
          <v-toolbar class="brown" >
            <!-- <v-spacer></v-spacer> -->
							<v-toolbar-title>{{proj.projectName}}</v-toolbar-title>

					</v-toolbar>
            <v-card elevation="5" class="pa-5">
              <p> {{proj.shortDescription}}</p>
              <hr>
              <p> Language utilisé : </p>
              <ul v-for="skill in proj.languagesInvolved" :key="skill.id">
                <li>
                  {{skill.skillName}}
                </li>
              </ul>
              <v-btn
                icon
                @click="show = !show"
              >
              <v-tooltip bottom></v-tooltip>
              <v-icon >{{ show ? 'mdi-minus' : 'mdi-plus' }}</v-icon>
              {{show ? "Moins" : "Plus"}}
              </v-btn>

                <v-expand-transition>
              <div v-show="show">
                <v-divider></v-divider>
                  {{proj.longDescription}}
                <v-card-text>
                 
                </v-card-text>
              </div>
            </v-expand-transition>
            </v-card>
          </v-col>
        </v-row>
      <!-- </v-container> -->
            <!-- <v-sheet
              min-height="70vh"
              rounded="lg"
            >
            </v-sheet> -->
          </v-col>
          <v-col
            cols="12"
            sm="2"
          >
            <v-card
              rounded="lg"
              height="268"
              elevation="5"
              class="pa-4"
            >
            
               <v-card
              height="30%"
              elevation="4"
              class="ma-2"
              color="#007bb5"
              :href="userLink.linkedin"
              target="blank"
            >
            <div class="a"><v-icon dark large>mdi-linkedin </v-icon> Linkedin</div>
            
            </v-card>
            
            <v-card
              height="30%"
              elevation="4"
              class="ma-2"
              color="#24292e"
              :href="userLink.github"
              target="blank"
            >
            <div class="a pa-2"><v-icon dark large>mdi-github </v-icon>GitHub </div>
            </v-card>
            <v-card
              height="30%"
              elevation="4"
              class="ma-2 insta"
              :href="userLink.instagram"
              target="blank"
            >
            <div class="pa-2 a"><v-icon dark large>mdi-instagram </v-icon> Instagram</div>
            </v-card>
            </v-card>
            
          </v-col>
        </v-row>
        
         
      </v-container>
    </v-main>
    <!-- <v-main>
      <v-container>
        <v-row>
            <v-col cols="0">
            <v-card outlined tile elevation="5" height="200px"></v-card>
            </v-col>
        </v-row>
            <v-row>
          <v-col
            v-for="n in 24"
            :key="n"
            cols="4"
          >
            <v-card height="200"></v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main> -->
</template>

<script>
// Popup Import
import ProjectFormPopup from './ProjectFormPopup'
import SkillFormPopup from './SkillFormPopup'
import Pmap from './Pmap'  
import PictureForm from './PictureForm'
import LinkForm from './LinkForm'



  export default {
    components : { ProjectFormPopup, SkillFormPopup, PictureForm, Pmap, LinkForm },
      name: 'user',
      
    data(){
        return {
          
          isAdmin: false,
          show: false,
          carte : false,
            userInfos: '',
                       
            userId: '',
            userProjects: {},
            userLink: [],
            skillName :'',
            skillListe:[]
        }
    },
    mounted: async function (){
        if(this.$session.get("userId")){
          this.isAdmin = true;
        }
        await this.getUserInfos();
        await this.getUserProjects();
       
        this.userInfos.userFirstName = this.capitalizeFirstLetter(this.userInfos.userFirstName);
        this.skillListe = this.userInfos.skillsList;
        this.listProject = this.userProjects;
        for( let i = 0 ; i < this.userInfos.linkList.length ; i++){
          if(this.userInfos.linkList[i].linkTarget == "github"){
            this.userLink.github = this.userInfos.linkList[i].URL
          }else if(this.userInfos.linkList[i].linkTarget == "instagram"){
            this.userLink.instagram = this.userInfos.linkList[i].URL
          }else if(this.userInfos.linkList[i].linkTarget == "linkedin"){
            this.userLink.linkedin = this.userInfos.linkList[i].URL
          }
        }
        //this.userLink = this.userInfos.linkList
        
        
        
    },
    methods: {
        getUserInfos: async function (){
           
            var jsonContent = await fetch(`http://localhost:3000/user/id/${this.$route.params.idUser}`);
            var json = await jsonContent.json();
            this.userInfos = json[0];
            this.carte = true;
            
            
        },
        getUserProjects: async function(){
            var jsonContent = await fetch(`http://localhost:3000/user/id/${this.userInfos._id}/projects`);
            var json = await jsonContent.json();
            this.userProjects = json;
        },
        capitalizeFirstLetter: function(string) {
            string = string.toLowerCase();
            return string.charAt(0).toUpperCase() + string.slice(1);
        },
        logout: function() {
            this.$session.destroy();
            window.location.reload();
        },
        
       
    },
    
  }
   
</script>
<style lang="css" scoped>
h3.capitalize{
    text-transform: capitalize;
}
.insta {
  background: #f09433; 
background: -moz-linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%); 
background: -webkit-linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%); 
background: linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%); 
filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#f09433', endColorstr='#bc1888',GradientType=1 );
}
.a{
  font-size: 16px;
  color: aliceblue;
  padding: 0.5em;
  
    }
</style>