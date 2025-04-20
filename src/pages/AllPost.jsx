import React, { useEffect } from 'react'
import { Container, PostCard } from '../components/index'
import appwriteService from "../appwrite/config";
import { selectPosts, setPosts } from '../store/postSlice';
import { useSelector, useDispatch } from 'react-redux';

function AllPosts() {
    const dispatch = useDispatch()
    const posts = useSelector(selectPosts)

    useEffect(() => {
        if (posts.length === 0) {
            appwriteService.getPosts().then((res) => {
                if (res) {
                    dispatch(setPosts(res.documents))
                }
            })
        }
    }, [])
    

    return (
        <div className='w-full py-8'>
            <Container>
                <div className='flex flex-wrap'>
                    {posts.map((item) => (
                        <div key={item.$id} className='p-2 w-1/4'>
                            <PostCard {...item} />
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    )
}

export default AllPosts
