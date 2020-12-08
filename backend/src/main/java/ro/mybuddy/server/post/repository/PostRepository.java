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

@Repository
public interface PostRepository extends JpaRepository<Post,String> {
    List<Post> findAll();
    Post save(Post post);
    List<Post> findPostsByTagsContains(Tag tag);
    void delete(Post post);
    Post findPostById(String id);
    @Query(value="select * from Posts as post where (:username is null or :username=post.user_id) and " +
            "(\"any\" in :tags or (select count(*) from posts_tags where posts_tags.post_id=post.id and posts_tags.tags_name in :tags) > 0) and " +
            "(:type is null or :type=post.type) and " +
            "(:radius = 0 or 6371*2*ATAN2(SQRT(POW(SIN((:lat - post.latitude) * PI() / 360),2) + POW(SIN((:long - post.longitude) * PI() / 360),2) * COS(:lat) * COS(post.latitude)),1-SQRT(POW(SIN((:lat - post.latitude) * PI() / 360),2) + POW(SIN((:long - post.longitude) * PI() / 360),2) * COS(:lat) * COS(post.latitude)))<=:radius) " +
            "order by (select count(*) from posts_tags where posts_tags.post_id=post.id and posts_tags.tags_name in :tags) DESC"
            ,nativeQuery = true)
    List<Post> findPostsFiltered(@Param("tags") List<Tag> l, @Param("username") Long username, @Param("type")Integer type,@Param("long") Double longit,@Param("lat") Double lat,@Param("radius") Double range, Pageable page);
    @Query(value="select * from Posts as post where (:username is null or :username=post.user_id) and " +
            "(\"any\" in :tags or (select count(*) from posts_tags where posts_tags.post_id=post.id and posts_tags.tags_name in :tags) > 0) and " +
            "(:type is null or :type=post.type) and " +
            "(:radius = 0 or 6371*2*ATAN2(SQRT(POW(SIN((:lat - post.latitude) * PI() / 360),2) + POW(SIN((:long - post.longitude) * PI() / 360),2) * COS(:lat) * COS(post.latitude)),1-SQRT(POW(SIN((:lat - post.latitude) * PI() / 360),2) + POW(SIN((:long - post.longitude) * PI() / 360),2) * COS(:lat) * COS(post.latitude)))<=:radius) " +
            "order by (select count(*) from posts_tags where posts_tags.post_id=post.id and posts_tags.tags_name in :tags) DESC"
            ,nativeQuery = true)
    List<Post> findPostsFiltered(@Param("tags") List<Tag> l, @Param("username") Long username, @Param("type")Integer type,@Param("long") Double longit,@Param("lat") Double lat,@Param("radius") Double range);
    Page<Post> findAll(Pageable p);
}
