package com.hafiz.portfolio.service;

import com.hafiz.portfolio.dto.request.ContactRequest;
import com.hafiz.portfolio.entity.ContactMessage;
import com.hafiz.portfolio.repository.ContactMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class ContactService {

    private final ContactMessageRepository contactMessageRepository;

    @Transactional
    public ContactMessage submit(ContactRequest request) {
        ContactMessage message = ContactMessage.builder()
                .name(request.getName())
                .email(request.getEmail())
                .subject(request.getSubject())
                .message(request.getMessage())
                .build();
        return contactMessageRepository.save(message);
    }

    public Page<ContactMessage> getAll(Pageable pageable) {
        return contactMessageRepository.findAllByOrderByCreatedAtDesc(pageable);
    }

    public Page<ContactMessage> getUnread(Pageable pageable) {
        return contactMessageRepository.findByReadFalseOrderByCreatedAtDesc(pageable);
    }

    public long countUnread() {
        return contactMessageRepository.countByReadFalse();
    }

    @Transactional
    public ContactMessage markAsRead(Long id) {
        ContactMessage message = contactMessageRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Message not found with id: " + id));
        message.setRead(true);
        message.setReadAt(LocalDateTime.now());
        return contactMessageRepository.save(message);
    }

    @Transactional
    public void delete(Long id) {
        if (!contactMessageRepository.existsById(id)) {
            throw new NoSuchElementException("Message not found with id: " + id);
        }
        contactMessageRepository.deleteById(id);
    }
}
