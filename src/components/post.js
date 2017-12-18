import React, {Component} from 'react';
import axios from 'axios';
import Markdown from 'react-markdown';
import Spinner from 'react-spinkit';

class Post extends Component {
     constructor(props){
          super(props)
          this.state = {
               topic: null,
               comments: null,
               externalLink: null,
               domain: null,
               embeddedMedia: null,
               embeddedText: null,
               previewImage: null,
               error: false,
          }
     }

     componentWillMount = () =>{
          this.getRedditComment();
     }

     getRedditComment(){
          /*
           * Get comments for the reddit post using the parameter passed through the link.
           */

          var $this = this;

          var article = this.props.match.params[0];

          var commentEndpoint = `https://www.reddit.com/comments/${article}.json?raw_json=1`;

          var externalLink = null;

          var comments = null;

          var embeddedMedia = null;

          var embeddedText = null;

          var previewImage = null;

          console.log(commentEndpoint);

          axios.get(commentEndpoint)
          .then((response)=>{

               var redditResponse = response.data;

               if (!redditResponse[0].data.children[0].data.domain.includes('i.redd.it')){
                    //post using external link
                    externalLink = redditResponse[0].data.children[0].data.url;
               }


               if (redditResponse.length > 1){
                    //there are comments for this posts
                    comments = redditResponse[1].data.children;
                    console.log(comments);
               }

               if (redditResponse[0].data.children[0].data.selftext){
                    //there's text embedded to the posts
                    embeddedText = redditResponse[0].data.children[0].data.selftext;
               }

               if (redditResponse[0].data.children[0].data.media_embed){
                    //there's embedded media
                    embeddedMedia = redditResponse[0].data.children[0].data.media_embed.content;
               }

               if (redditResponse[0].data.children[0].data.preview){
                    if (redditResponse[0].data.children[0].data.preview.images.length > 0){
                         //there's preview image
                         previewImage = redditResponse[0].data.children[0].data.preview.images[0].source.url;
                    }
               }


               this.setState({topic: redditResponse[0].data.children[0].data.title,
                              comments: comments,
                              topicAuthor: redditResponse[0].data.children[0].data.author,
                              topicDate: $this.unixToDate(redditResponse[0].data.children[0].data.created_utc),
                              externalLink: externalLink,
                              domain: redditResponse[0].data.children[0].data.domain,
                              embeddedMedia: embeddedMedia,
                              embeddedText: embeddedText,
                              previewImage: previewImage,
                         });


          })
          .catch((error)=>{
               console.log('ERROR: ', error);
               this.setState({error: true});

          })

     }

     renderComments = () =>{
          /*
           * Rendering comments from the posts.
           */
          if (this.state.comments === null){
               return <div className='no-post-comments'>Sorry there is no comments for this post</div>
          }


          const comments = this.state.comments.map((comment, idx)=>{
               if (comment.kind === 't1'){
                    return(
                         <div key={idx} className='post-comments'>
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
          var date = new Date(time*1000);
          return `${date.toDateString()}, ${date.toLocaleTimeString()}`;
     }

     render = () =>{
          if (this.state.topic === null && this.state.error === false){
               return(
                    <div className='post-detail'>
                         <Spinner name='double-bounce' style={{marginLeft: 'auto', marginRight: 'auto', marginTop:15, marginBottom:15}}/>
                    </div>
               );
          }


          if (this.state.error === true){
               return <div className='page-dne'>Sorry page not found :(</div>
          }


          return(
               <div className='post-detail'>
                    <div className='post-title'>
                         <h2>{this.state.externalLink?
                              <a href={this.state.externalLink} target='_blank' className='external_url'>{this.state.topic}</a>
                              :
                              `${this.state.topic}`}
                              <span className='domain'>({this.state.domain})</span>
                         </h2>
                         <div className='post-author' style={{padding: 0, margin: 0, fontSize: 13}}>by {this.state.topicAuthor}, {this.state.topicDate}</div>
                         {this.state.embeddedMedia? <div className='post-embedded-media' ><div dangerouslySetInnerHTML={{__html: this.state.embeddedMedia}}/></div> : ''}
                         {this.state.previewImage? <div className='post-embedded-media'><img src={this.state.previewImage}/></div>: ''}
                         {this.state.embeddedText? <div className='post-embedded-text'><Markdown source={this.state.embeddedText}/></div>: ''}
                    </div>
                    {this.renderComments()}
               </div>
          );

     }
};

export default Post;
