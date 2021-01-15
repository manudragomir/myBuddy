package ro.mybuddy.server.post.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ro.mybuddy.server.post.model.FilterPrototype;
import ro.mybuddy.server.post.model.Post;
import ro.mybuddy.server.post.utils.TypePost;
import ro.mybuddy.server.tag.model.Tag;

import java.util.List;

/**
 * Repository used to persist data in database
 */
@Repository
public interface PostRepository extends JpaRepository<Post,String> {
    /**
     * Find all posts
     * @return List of posts containing all posts from the database
     */
    List<Post> findAll();

    /**
     * Save a post in database
     * @param post The post to be saved
     * @return The post saved in the database
     */
    Post save(Post post);

    /**
     * Find all posts which has a tag
     * @param tag The tag used to filter the posts
     * @return List of requested posts
     */
    List<Post> findPostsByTagsContains(Tag tag);

    /**
     * Delete a post from the database
     * @param post The post to be deleted
     */
    void delete(Post post);

    /**
     * Find a post by id
     * @param id The id used to search the post
     * @return The post containing the specified id
     */
    Post findPostById(String id);
    /**
     * Find all posts filtered by the specified criteria
     * @param l If specified the posts are sorted descending by the number of common elements between this param and the tags of the post
     * @param username If specified the posts must belong to the specified user
     * @param type If specified the posts must have the requested type
     * @param longit Representing the longitude
     * @param lat Representing the latitude
     * @param range If specified along with longit and lat then the posts must be situated in the given range
     * @param page If specified only the requested page will be returned
     * @return List of requested Posts
     */
    @Query(value="select * from Posts as post where (:username is null or :username=post.user_id) and " +
            "(\"any\" in :tags or (select count(*) from posts_tags where posts_tags.post_id=post.id and posts_tags.tags_name in :tags) > 0) and " +
            "(:type is null or :type=post.type) and " +
            "(:radius = 0 or 6371*2*ATAN2(SQRT(POW(SIN((:lat - post.latitude) * PI() / 360),2) + POW(SIN((:long - post.longitude) * PI() / 360),2) * COS(:lat) * COS(post.latitude)),1-SQRT(POW(SIN((:lat - post.latitude) * PI() / 360),2) + POW(SIN((:long - post.longitude) * PI() / 360),2) * COS(:lat) * COS(post.latitude)))<=:radius) " +
            "order by (select count(*) from posts_tags where posts_tags.post_id=post.id and posts_tags.tags_name in :tags) DESC"
            ,nativeQuery = true)
    List<Post> findPostsFiltered(@Param("tags") List<Tag> l, @Param("username") Long username, @Param("type")Integer type,@Param("long") Double longit,@Param("lat") Double lat,@Param("radius") Double range, Pageable page);
    /**
     * Find all posts filtered by the specified criteria
     * @param l If specified the posts are sorted descending by the number of common elements between this param and the tags of the post
     * @param username If specified the posts must belong to the specified user
     * @param type If specified the posts must have the requested type
     * @param longit Representing the longitude
     * @param lat Representing the latitude
     * @param range If specified along with longit and lat then the posts must be situated in the given range
     * @return List of requested Posts
     */
    @Query(value="select * from Posts as post where (:username is null or :username=post.user_id) and " +
            "(\"any\" in :tags or (select count(*) from posts_tags where posts_tags.post_id=post.id and posts_tags.tags_name in :tags) > 0) and " +
            "(:type is null or :type=post.type) and " +
            "(:radius = 0 or 6371*2*ATAN2(SQRT(POW(SIN((:lat - post.latitude) * PI() / 360),2) + POW(SIN((:long - post.longitude) * PI() / 360),2) * COS(:lat) * COS(post.latitude)),1-SQRT(POW(SIN((:lat - post.latitude) * PI() / 360),2) + POW(SIN((:long - post.longitude) * PI() / 360),2) * COS(:lat) * COS(post.latitude)))<=:radius) " +
            "order by (select count(*) from posts_tags where posts_tags.post_id=post.id and posts_tags.tags_name in :tags) DESC"
            ,nativeQuery = true)
    List<Post> findPostsFiltered(@Param("tags") List<Tag> l, @Param("username") Long username, @Param("type")Integer type,@Param("long") Double longit,@Param("lat") Double lat,@Param("radius") Double range);

    /**
     * Find the specified page of posts
     * @param p The index of the page to be returned
     * @return List of requested posts
     */
    Page<Post> findAll(Pageable p);
}
