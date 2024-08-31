package com.vanderlinde.rrss;

import com.vanderlinde.rrss.config.RsaKeyProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@EnableConfigurationProperties(RsaKeyProperties.class)
@SpringBootApplication
public class RrssApplication {

	public static void main(String[] args) {
		SpringApplication.run(RrssApplication.class, args);
	}

}