import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';

class Home extends Component {
     constructor(props){
          super(props)
          this.state = {
               hotposts: null,
               nextPage: null,
               beforePage: [],
               error: false,
               tmp: [],
          }
     }
     componentWillMount =()=>{
          this.getHotReddit();
     }

     getHotReddit = (page, direction) =>{
          /*
           * Retrieves the Hottest Reddit posts using Reddit's /hot endpoint.
           *` page`       : describes the page were going to based on its fullname of that reddit page
           *` direction`  : direction the page is paginating, it's either before or after
          */

          var $this = this;

          var posts = 'https://www.reddit.com/hot.json';

          if (page !== undefined){
               posts = posts + '?' + direction + '=' + page;
          }

          var  beforePage = this.state.beforePage;
          if (direction === 'after'){
               beforePage.push(this.state.nextPage);
          }

          axios.get(posts)
          .then(function(response){
               var posts = response.data.data;

               window.scrollTo(0,0);

               if (direction === 'before'){
                    console.log('before');
                    $this.setState({hotposts: posts.children, nextPage: page, beforePage: beforePage});
               }else{
                    console.log('after', posts);
                    $this.setState({hotposts: posts.children, nextPage: posts.after, beforePage: beforePage});
               }

          })
          .catch(function(error){
               $this.setState({error: true});
          });
     }

     renderHotPosts = () => {
          //renders the posts in a simple list view
          const posts = this.state.hotposts.map((posts, idx)=>{
               return (
                    <Link key={idx} to='/#' className='posts'>{posts.data.title}</Link>
               );
          });
          return posts;
     }

     paginate = (direction) => {
          //paginating the pages of hot posts in either direction before/after
          if (direction === 'before'){
               var  beforePage = this.state.beforePage;
               var nextPage = beforePage.pop();
               this.getHotReddit(nextPage, 'before');
          }else{
               this.getHotReddit(this.state.nextPage, 'after');
          }
     }

     render = () =>{
          console.log("rendering", this.state);
          if (this.state.hotposts === null){
               return(
                    <div className='home' style={{textAlign: 'center', marginTop: 40}}>
                         Loading ...
                    </div>
               )
          }
          return(
               <div className='home'>
                    {this.renderHotPosts()}

                    <div className='paginate'>
                         {this.state.beforePage.length > 0 ? <div className='before' onClick={()=>this.paginate('before')}>Before</div>: <div className='before none'>Before</div>}
                         <div className='next' onClick={() => this.paginate('after')}>Next</div>
                    </div>
               </div>
          );
     }
};

export default Home;
