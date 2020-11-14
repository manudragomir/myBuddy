package ro.mybuddy.server.post.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ro.mybuddy.server.post.model.Index;

import java.util.List;

@Repository
public interface IndexRepository extends JpaRepository<Index,Integer> {
    List<Index> findAll();
    Index save(Index index);
    void deleteAll();
}
