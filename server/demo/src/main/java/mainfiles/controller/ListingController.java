package mainfiles.controller;

import lombok.AllArgsConstructor;
import mainfiles.dto.ListingDTO;
import mainfiles.service.ListingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// to access createlisting make sure to put JWT token from logging in into the bearer token field for createlisting api
// this way it associates the jwt token for an account to a listing

@RestController
@RequestMapping("/api/listings")
@CrossOrigin("*")
@AllArgsConstructor
public class ListingController {

    private final ListingService listingService;

    // Create a new listing
    @PostMapping
    public ResponseEntity<ListingDTO> createListing(@RequestBody ListingDTO listingDTO) {
        ListingDTO createdListing = listingService.createListing(listingDTO);
        return new ResponseEntity<>(createdListing, HttpStatus.CREATED);
    }

    // Get a listing by ID
    @GetMapping("/{id}")
    public ResponseEntity<ListingDTO> getListingById(@PathVariable Long id) {
        ListingDTO listing = listingService.getListingById(id);
        return new ResponseEntity<>(listing, HttpStatus.OK);
    }

    // Get all listings
    @GetMapping
    public ResponseEntity<List<ListingDTO>> getAllListings() {
        List<ListingDTO> listings = listingService.getAllListings();
        return new ResponseEntity<>(listings, HttpStatus.OK);
    }

    // Update a listing
    @PutMapping("/{id}")
    public ResponseEntity<ListingDTO> updateListing(@PathVariable Long id, @RequestBody ListingDTO listingDTO) {
        ListingDTO updatedListing = listingService.updateListing(id, listingDTO);
        return new ResponseEntity<>(updatedListing, HttpStatus.OK);
    }

    // Delete a listing
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteListing(@PathVariable Long id) {
        listingService.deleteListing(id);
        return new ResponseEntity<>("Listing deleted successfully", HttpStatus.OK);
    }
}
