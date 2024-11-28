package mainfiles.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "listings")
public class Listing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String subject;

    @Column(nullable = false)
    private float amount;

    private String description;

    // element collection specifies image urls to be stored in a different table
    @ElementCollection
    // new table is called listing_images and it joins columns with listing_id
    @CollectionTable(name = "listing_images", joinColumns = @JoinColumn(name = "listing_id"))
    @Column(name = "image_url")
    // stores image urls from Cloudinary as Strings in database
    private List<String> images;


    // many to One relationship with User and only loads user from database if specifically asked
    @ManyToOne(fetch = FetchType.LAZY)
    // join user_id column in database table
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
