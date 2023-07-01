import React from "react";
import { ethers } from "ethers";
import BlogArtifact from "../contracts/Blog.json";
import contractAddress from "../contracts/contract-address.json";

export class Blog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      posts: [],
      selectedAddress: null,
      provider: null,
      contract: null,
      newPostTitle: '',
      newPostContent: '',
      renderKey: 0,
    };

    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleContentChange = this.handleContentChange.bind(this);
  }

  componentDidMount() {
    this._initialize();
  }

  async _initialize() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(
      contractAddress.Blog,
      BlogArtifact.abi,
      provider.getSigner(0)
    );

    this.setState({ 
      selectedAddress: await provider.getSigner(0).getAddress(),
      provider,
      contract
    }, this._updatePosts);
  }

  async _updatePosts() {
    const numberOfPosts = await this.state.contract.getNumberOfPosts();
  
    const posts = [];
    for (let i = 0; i < numberOfPosts; i++) {
      const [title, content, isDeleted] = await this.state.contract.getPost(i);
      // Only push the post into the array if it's not marked as deleted
      if (!isDeleted) {
        posts.push({ title, content });
      }
    }
  
    this.setState({ posts });
  }
  
  

  handleTitleChange(event) {
    this.setState({newPostTitle: event.target.value});
  }

  handleContentChange(event) {
    this.setState({newPostContent: event.target.value});
  }

  async createPost() {
    const { newPostTitle, newPostContent } = this.state;
    await this.state.contract.createPost(newPostTitle, newPostContent);
    await this._updatePosts();
    this.setState({ newPostTitle: '', newPostContent: '' }); // Reset input fields after creating post
  }

  async deletePost(index) {
    await this.state.contract.deletePost(index);
    await this._updatePosts();
    this.forceUpdate();
  }

  forceUpdate() {
    this.setState(prevState => ({ renderKey: prevState.renderKey + 1 }));
  }

  render() {
    const { newPostTitle, newPostContent, posts, renderKey } = this.state;
  
    return (
      <div key={renderKey}>
        <h1>Blog Posts</h1>
        <ul>
          {posts.map((post, index) => (
            <li key={index}>
              <h2>{post.title}</h2>
              <p>{post.content}</p>
              <button onClick={() => this.deletePost(index)}>Delete</button>
            </li>
          ))}
        </ul>
        <input 
          type="text" 
          value={newPostTitle} 
          onChange={this.handleTitleChange} 
          placeholder="Enter title here" 
        />
        <textarea 
          value={newPostContent} 
          onChange={this.handleContentChange} 
          placeholder="Enter content here" 
        />
        <button onClick={() => this.createPost()}>Create Post</button>
      </div>
    );
  }
}
