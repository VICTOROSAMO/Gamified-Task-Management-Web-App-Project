package com.Gamified.Task.Management.Web.App;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication(exclude = {SecurityAutoConfiguration.class})
public class GamifiedTaskManagementWebAppApplication {

	public static void main(String[] args) {
		SpringApplication.run(GamifiedTaskManagementWebAppApplication.class, args);
	}

}
