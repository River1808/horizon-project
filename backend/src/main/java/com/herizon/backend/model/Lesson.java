package com.herizon.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "lessons")
public class Lesson {

    @Id
    private String id;

    private String title;
    private String category;
    private String level;
    private String description;
    private String content;
    private String imageUrl; // <--- added (optional)

    public Lesson() {}

    public Lesson(String title, String category, String level, String description, String content, String imageUrl) {
        this.title = title;
        this.category = category;
        this.level = level;
        this.description = description;
        this.content = content;
        this.imageUrl = imageUrl;
    }

    // ====== GETTERS & SETTERS ======
    public String getId() { 
        return id; 
    }
    public void setId(String id) { 
        this.id = id; 
    }

    public String getTitle() { 
        return title; 
    }
    public void setTitle(String title) { 
        this.title = title; 
    }

    public String getCategory() { 
        return category; 
    }
    public void setCategory(String category) { 
        this.category = category; 
    }

    public String getLevel() { 
        return level; 
    }
    public void setLevel(String level) { 
        this.level = level; 
    }

    public String getDescription() { 
        return description; 
    }
    public void setDescription(String description) { 
        this.description = description; 
    }

    public String getContent() { 
        return content; 
    }
    public void setContent(String content) { 
        this.content = content; 
    }

    public String getImageUrl() { 
        return imageUrl; 
    }
    public void setImageUrl(String imageUrl) { 
        this.imageUrl = imageUrl; 
    }
}