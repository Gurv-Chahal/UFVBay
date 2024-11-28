package mainfiles.config;

// this class is for Cloudinary api used to upload images on websites


import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

// @configuration will inject bean into spring context
@Configuration
public class CloudinaryConfig {

    //using @Value to extract data from application.properties file and inject into fields

    @Value("${cloudinary.cloud-name}")
    private String cloudName;

    @Value("${cloudinary.api-key}")
    private String apiKey;

    @Value("${cloudinary.api-secret}")
    private String apiSecret;


    // returns instance of Cloudinary class
    @Bean
    public Cloudinary cloudinary() {

        // constructor uses map to create key-value pairs for parameters to Cloudinary account
        Cloudinary cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret,
                "secure", true
        ));
        return cloudinary;
    }

}
