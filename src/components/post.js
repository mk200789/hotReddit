import React, {Component} from 'react';
import axios from 'axios';
var Markdown = require('react-markdown');

class Post extends Component {
     constructor(props){
          super(props)
          this.state = {
               topic: null,
               comments: null,
               external_link: null,
               domain: null,
          }
     }

     componentWillMount = () =>{
          this.getRedditComment();
     }

     getRedditComment(){
          /*
           * Get comments for the reddit post using the parameter passed through the link.
           */
          var article = this.props.match.params[0];

          var comments = `https://www.reddit.com/comments/${article}.json`;

          var external_link = null;

          axios.get(comments)
          .then((response)=>{

               var response = response.data;

               console.log(response[1].data.children);

               if (response.length > 1){

                    if (!response[0].data.children[0].data.domain.includes('i.redd.it')){
                         //post using external link
                         external_link = response[0].data.children[0].data.domain;
                    }

                    this.setState({topic: response[0].data.children[0].data.title,
                                   comments: response[1].data.children,
                                   external_link: response[0].data.children[0].data.url,
                                   domain: response[0].data.children[0].data.domain});

               }else{
                    //no comments for this post
                    this.setState({topic: response[0].data.children[0].data.title});
               }

          })
          .catch((error)=>{
               console.log('ERROR: ', error);
          })

     }

     renderComments = () =>{
          /*
           * Rendering comments from the posts.
           */
          const comments = this.state.comments.map((comment, idx)=>{
               if (comment.kind === 't1'){
                    return(
                         <div key={idx} style={{margin:20, padding: 10, backgroundColor: 'pink'}}>
                              <Markdown source={comment.data.body}/>
                              <div style={{fontSize: 10}}>{comment.data.author} , {this.unixToDate(comment.data.created_utc)}</div>
                         </div>
                    );
               }

          });

          return comments;
     }

     unixToDate = (time) =>{
          /*
           * Converting UNIX-timestamp to a readable date format.
           */
          return new Date(time*1000).toDateString();
     }

     render = () =>{
          console.log(this.state);
          if (this.state.topic === null){
               return(
                    <div className='post-detail'>
                         This is post detail page
                    </div>
               );
          }
          return(
               <div className='post-detail' style={{padding: 10}}>
                    <div style={{display: 'flex'}}>
                         <h2>{this.state.external_link?
                              <a href={this.state.external_link} target='_blank' className='external_url'>{this.state.topic}</a>
                              :
                              `${this.state.topic}`}
                              <span className='domain'>({this.state.domain})</span>
                         </h2>
                    </div>
                    {this.renderComments()}
               </div>
          );

     }
};

export default Post;
