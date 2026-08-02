package K23.CNT1._5.DAQ.quan.comdemo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageViewController {

    @GetMapping("/")
    public String index() {
        return "auth/login";
    }

    @GetMapping("/login")
    public String login() {
        return "auth/login";
    }

    @GetMapping("/register")
    public String register() {
        return "auth/register";
    }

    @GetMapping("/dashboard")
    public String dashboard() {
        return "pages/dashboard";
    }

    @GetMapping("/employees")
    public String employees() {
        return "pages/employees";
    }

    @GetMapping("/departments")
    public String departments() {
        return "pages/departments";
    }

    @GetMapping("/positions")
    public String positions() {
        return "pages/positions";
    }

    @GetMapping("/attendance")
    public String attendance() {
        return "pages/attendance";
    }

    @GetMapping("/schedule")
    public String schedule() {
        return "pages/schedule";
    }

    @GetMapping("/salary")
    public String salary() {
        return "pages/salary";
    }

    @GetMapping("/my-salary")
    public String mySalary() {
        return "pages/my-salary";
    }

    @GetMapping("/rewards")
    public String rewards() {
        return "pages/rewards";
    }

    @GetMapping("/leaves")
    public String leaves() {
        return "pages/leaves";
    }

    @GetMapping("/reports")
    public String reports() {
        return "pages/reports";
    }

    @GetMapping("/profile")
    public String profile() {
        return "pages/profile";
    }
}
