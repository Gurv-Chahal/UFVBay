package mainfiles.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

/*
DTO class for listing information in database to make sure the information in database isn't directly accessed
 */

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ListingDTO {

    private Long id;
    private String title;
    private String subject;
    private Float amount;
    private String description;
    private Long userId;
    // added this List of type string to hold image urls obtained from cloudinary
    private List<String> imageUrls;
}
