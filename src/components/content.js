import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';


class Content extends Component {
     constructor(props){
          super(props)
          this.state = {
               hotposts: null,
               nextPage: null,
               beforePage: [],
               error: false,
               limit: 5,
          }
     }
     componentWillMount =()=>{
          if (Object.keys(this.props.match.params).length > 1){
               this.getHotReddit(this.props.match.params[1], this.props.match.params[0], this.props.match.params[2])
          }else{
               this.getHotReddit();
          }
     }


     getHotReddit = (page, direction, count) =>{
          /*
           * Retrieves the Hottest Reddit posts using Reddit's /hot endpoint.
           *` page`       : describes the page were going to based on its fullname of that reddit page
           *` direction`  : direction the page is paginating, it's either before or after
          */

          var $this = this;

          var postEndpoint = `https://www.reddit.com/r/all/hot.json?raw_json=1&limit=${this.state.limit}`;

          if (page !== undefined){

               postEndpoint = `${postEndpoint}&${direction}=${page}&count=5`;
          }


          axios.get(postEndpoint)
          .then(function(response){
               var posts = response.data.data;

               window.scrollTo(0,0);

               $this.setState({hotposts: posts.children, nextPage: posts.after, beforePage: posts.before });

          })
          .catch(function(error){
               $this.setState({error: true});
          });
     }

     renderHotPosts = () => {
          //renders the posts in a simple list view
          const posts = this.state.hotposts.map((posts, idx)=>{
               return (
                    <div key={idx} className='posts'>
                         <div className='posts-score'>
                              <div className='posts-score-name'>Score</div>
                              <p>{posts.data.score}</p>
                         </div>
                         <div className='posts-image'>
                              {posts.data.thumbnail.includes('http')? <img src={posts.data.thumbnail} alt='thumbnail'></img> : <img src={require('../images/no_thumbnail.png')} alt='thumbnail'></img>}
                         </div>
                         <div className='posts-content'>
                              <Link to={`/posts=${posts.data.id}`} className='postsLink'>{posts.data.title}</Link>
                         </div>
                    </div>
               );
          });
          return posts;
     }

     render = () =>{

          if (this.state.hotposts === null){
               return(
                    <div className='home load'>
                         Loading ...
                    </div>
               )
          }

          return(
               <div className='home'>
                    {this.renderHotPosts()}

                    <div className='paginate'>
                         {
                              this.state.beforePage ?
                                    <a className='before' href={`/before=${this.state.beforePage}`}>Before</a>: ''
                          }
                          <a className='next' href={`/after=${this.state.nextPage}`} >Next</a>
                    </div>

               </div>
          );


     }
};

export default Content;
