package com.techstore.repository.backup;

import com.techstore.entity.backup.Backup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BackupRepository extends JpaRepository<Backup, String> {
    Optional<Backup> findByFileName(String fileName);
    java.util.List<Backup> findAllByOrderByCreatedAtDesc();
}
