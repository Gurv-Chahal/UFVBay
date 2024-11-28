package mainfiles.controller;

import lombok.AllArgsConstructor;
import mainfiles.dto.ListingDTO;
import mainfiles.dto.UserDTO;
import mainfiles.entity.User;
import mainfiles.mapper.UserMapper;
import mainfiles.repository.ListingRepository;
import mainfiles.repository.UserRepository;
import mainfiles.service.ListingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import mainfiles.utility.UserUtil;
import org.springframework.web.multipart.MultipartFile;

// to access createlisting make sure to put JWT token from logging in into the bearer token field for createlisting api
// this way it associates the jwt token for an account to a listing

@RestController
@RequestMapping("/api/listings")
@CrossOrigin("*")
@AllArgsConstructor
public class ListingController {

    // fields are injected into spring context using constructor injection
    private final ListingService listingService;
    private final UserUtil userUtil;
    private final UserRepository userRepository;


    // Create Listing api
    @PostMapping
    // responseentity returns HTTP response, response contains type ListingDTO
    public ResponseEntity<ListingDTO> createListing(
            //ModelAttribute binds listingDTO parameter to data from object
            @ModelAttribute ListingDTO listingDTO,
            // requestparam is used here to bind "images" to images variable
            // MultiPartFile[] is an array of objects representing uploaded image files
            @RequestParam("images") MultipartFile[] images) {
        try {

            // call createlisting impl in service class and store in createdListing
            ListingDTO createdListing = listingService.createListing(listingDTO, images);

            // return response (Example status 201 and the createdListing information)
            return new ResponseEntity<>(createdListing, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // Used in Item.jsx to get listing data by product id
    @GetMapping("/{id}")
    public ResponseEntity<ListingDTO> getListingById(@PathVariable Long id) {
        ListingDTO listing = listingService.getListingById(id);
        return new ResponseEntity<>(listing, HttpStatus.OK);
    }


    // Get All Listings
    @GetMapping
    public ResponseEntity<List<ListingDTO>> getAllListings() {
        List<ListingDTO> listings = listingService.getAllListings();
        return new ResponseEntity<>(listings, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ListingDTO> updateListing(@PathVariable Long id, @RequestBody ListingDTO listingDTO) {
        ListingDTO updatedListing = listingService.updateListing(id, listingDTO);
        return new ResponseEntity<>(updatedListing, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteListing(@PathVariable Long id) {
        listingService.deleteListing(id);
        return new ResponseEntity<>("Listing deleted successfully", HttpStatus.OK);
    }

    @GetMapping("/user")
    public ResponseEntity<List<ListingDTO>> getUserListings() {
        Long currentUserId = userUtil.getCurrentUserId();
        List<ListingDTO> listings = listingService.getListingsByUserId(currentUserId);
        return new ResponseEntity<>(listings, HttpStatus.OK);
    }

    @GetMapping("/userinfo")
    public ResponseEntity<UserDTO> getUserInfo() {

        // extract user ID from the JWT token
        Long userId = userUtil.getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        // map user entity to UserDTO
        UserDTO userDTO = UserMapper.mapToUserDTO(user);
        return ResponseEntity.ok(userDTO);
    }

}
