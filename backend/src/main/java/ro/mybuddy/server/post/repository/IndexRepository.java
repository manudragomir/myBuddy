package ro.mybuddy.server.post.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ro.mybuddy.server.post.model.Index;

import java.util.List;

/**
 * Repository used to persist data in database
 */
@Repository
public interface IndexRepository extends JpaRepository<Index,Integer> {
    /**
     * Find the index of the last post from the database
     * @return List of Int
     */
    List<Index> findAll();

    /**
     * Save the index in the database
     * @param index The index to be saved
     * @return The index saved
     */
    Index save(Index index);

    /**
     * Delete index from database
     */
    void deleteAll();
}
