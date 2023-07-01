// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Blog {
    struct Post {
        string title;
        string content;
        bool isDeleted; // New field to mark deleted posts
    }

    Post[] public posts;

    function createPost(string memory _title, string memory _content) public {
        posts.push(Post(_title, _content, false));
    }

    function deletePost(uint _index) public {
        require(_index < posts.length, "Index out of bounds");
        posts[_index].isDeleted = true; // Mark the post as deleted instead of using delete keyword
    }

    function getPost(uint _index) public view returns (string memory, string memory, bool) {
        require(_index < posts.length, "Index out of bounds");
        Post storage post = posts[_index];
        return (post.title, post.content, post.isDeleted);
    }

    function updatePost(uint _index, string memory _title, string memory _content) public {
        posts[_index].title = _title;
        posts[_index].content = _content;
    }

    function getNumberOfPosts() public view returns (uint) {
        return posts.length;
    }
}
