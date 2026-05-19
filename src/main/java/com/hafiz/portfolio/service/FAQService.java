package com.hafiz.portfolio.service;

import com.hafiz.portfolio.dto.request.FAQRequest;
import com.hafiz.portfolio.entity.FAQ;
import com.hafiz.portfolio.repository.FAQRepository;
import com.hafiz.portfolio.util.TranslationHelper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class FAQService {

    private final FAQRepository faqRepository;

    public List<FAQ> getAll() {
        return faqRepository.findAllByOrderByOrderWeightAsc();
    }

    @Transactional(readOnly = true)
    public List<FAQ> getAll(String lang) {
        List<FAQ> list = getAll();
        if (lang != null && !lang.equals("en")) list.forEach(f -> applyTranslations(f, lang));
        return list;
    }

    public List<FAQ> getByPage(FAQ.Page page) {
        return faqRepository.findByVisibleOnContainingOrderByOrderWeightAsc(page);
    }

    @Transactional(readOnly = true)
    public List<FAQ> getByPage(FAQ.Page page, String lang) {
        List<FAQ> list = getByPage(page);
        if (lang != null && !lang.equals("en")) list.forEach(f -> applyTranslations(f, lang));
        return list;
    }

    private void applyTranslations(FAQ f, String lang) {
        Map<String, Map<String, Object>> t = TranslationHelper.parse(f.getTranslations());
        f.setQuestion(TranslationHelper.str(t, lang, "question", f.getQuestion()));
        f.setAnswer(TranslationHelper.str(t, lang, "answer", f.getAnswer()));
    }

    public FAQ getById(Long id) {
        return faqRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("FAQ not found: " + id));
    }

    @Transactional
    public FAQ create(FAQRequest req) {
        FAQ f = FAQ.builder()
                .question(req.getQuestion())
                .answer(req.getAnswer())
                .category(req.getCategory())
                .orderWeight(req.getOrderWeight())
                .visibleOn(req.getVisibleOn())
                .translations(TranslationHelper.serialize(req.getTranslations()))
                .build();
        return faqRepository.save(f);
    }

    @Transactional
    public FAQ update(Long id, FAQRequest req) {
        FAQ f = getById(id);
        f.setQuestion(req.getQuestion());
        f.setAnswer(req.getAnswer());
        f.setCategory(req.getCategory());
        f.setOrderWeight(req.getOrderWeight());
        f.setVisibleOn(req.getVisibleOn());
        f.setTranslations(TranslationHelper.serialize(req.getTranslations()));
        return faqRepository.save(f);
    }

    @Transactional
    public void delete(Long id) {
        if (!faqRepository.existsById(id))
            throw new NoSuchElementException("FAQ not found: " + id);
        faqRepository.deleteById(id);
    }
}
