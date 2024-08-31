package com.vanderlinde.rrss.service;

import com.vanderlinde.rrss.model.Role;
import com.vanderlinde.rrss.repository.RoleRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RoleService {

    @Autowired
    private RoleRepository roleRepository;

    @PostConstruct
    public void init() {
        boolean userRoleExists = roleRepository.existsByName("USER");
        boolean adminRoleExists = roleRepository.existsByName("ADMIN");
        boolean merchantRoleExists = roleRepository.existsByName("MERCHANT");
        boolean pendingRoleExists = roleRepository.existsByName("PENDING");
        boolean rejectedRoleExists = roleRepository.existsByName("REJECTED");
        boolean bannedRoleExists = roleRepository.existsByName("BANNED");
        if(!userRoleExists){
            Role userRole = new Role();
            userRole.setName("USER");
            roleRepository.save(userRole);
        }
        if(!adminRoleExists){
            Role adminRole = new Role();
            adminRole.setName("ADMIN");
            roleRepository.save(adminRole);
        }
        if(!merchantRoleExists){
            Role merchantRole = new Role();
            merchantRole.setName("MERCHANT");
            roleRepository.save(merchantRole);
        }
        if(!pendingRoleExists){
            Role pendingRole = new Role();
            pendingRole.setName("PENDING");
            roleRepository.save(pendingRole);
        }
        if(!rejectedRoleExists){
            Role rejectedRole = new Role();
            rejectedRole.setName("REJECTED");
            roleRepository.save(rejectedRole);
        }
        if(!bannedRoleExists){
            Role bannedRole = new Role();
            bannedRole.setName("BANNED");
            roleRepository.save(bannedRole);
        }
    }
}
