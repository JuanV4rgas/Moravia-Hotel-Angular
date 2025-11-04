package com.moravia.demo.e2e;

import java.time.Duration;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.By;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.boot.actuate.autoconfigure.metrics.MetricsProperties.Web;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;

import io.github.bonigarcia.wdm.WebDriverManager;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("test")
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
public class FlujoReservaTest {
    private WebDriver driver;
    private WebDriverWait wait;
    private final String baseUrl = "http://localhost:4200";
    private final String baseXpathAuth = "/html/body/app-root/app-auth-layout/app-auth-wrap/div/app-auth-card/div";
    private final String baseXpathReserva = "/html/body/app-root/app-portal-layout/app-reserva-form/div/form/div";

    @BeforeEach
    public void init() {
        WebDriverManager.chromedriver().setup();
        ChromeOptions chromeOptions = new ChromeOptions();
        chromeOptions.addArguments("--disable-extensions");
        chromeOptions.addArguments("--disable-notifications");
        this.driver = new ChromeDriver(chromeOptions);
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(5));
    }

    @Test
    public void testFlujoCompletoDeRegistroYReserva() {
        driver.get(baseUrl + "/home");

        shortPause(2);

        driver.get(baseUrl + "/auth");

        shortPause(2);

        wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.xpath(baseXpathAuth)));

        WebElement registerButton = driver.findElement(org.openqa.selenium.By.xpath(
                baseXpathAuth + "/app-login-form/form/div[3]/button[2]"));
        registerButton.click();

        shortPause(2);
        llenarFormularioRegistro();

        shortPause(2);
        llenarFormularioLogin();

        shortPause(2);
        driver.get(baseUrl + "/reserva/nueva");
        shortPause(2);

        String inicioReserva = LocalDate.now().plusDays(7).format(DateTimeFormatter.ofPattern("dd-MM-yyyy"));
        String finReserva = LocalDate.now().plusDays(14).format(DateTimeFormatter.ofPattern("dd-MM-yyyy"));

        llenarFormularioReserva(inicioReserva, finReserva);

        shortPause(2);
        driver.get(baseUrl + "/mis-reservas");

        shortPause(2);
        driver.get(baseUrl + "/reserva/nueva");
        shortPause(2);

        String inicioReservaIntermedia = LocalDate.now().plusDays(8).format(DateTimeFormatter.ofPattern("dd-MM-yyyy"));
        String finReservaIntermedia = LocalDate.now().plusDays(13).format(DateTimeFormatter.ofPattern("dd-MM-yyyy"));

        llenarFormularioReserva(inicioReservaIntermedia, finReservaIntermedia);

        shortPause(2);
        driver.get(baseUrl + "/mis-reservas");
    }

    private void shortPause(int seconds) {
        try {
            Thread.sleep(seconds * 1000L);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    private void llenarFormularioLogin() {

        wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.xpath(baseXpathAuth)));

        shortPause(2);

        WebElement loginEmailInput = driver.findElement(
                org.openqa.selenium.By.xpath(
                        baseXpathAuth + "/app-login-form/form/div[1]/input"));

        loginEmailInput.sendKeys("juanang@gmail.com");

        shortPause(2);

        WebElement loginPasswordInput = driver.findElement(
                org.openqa.selenium.By.xpath(
                        baseXpathAuth + "/app-login-form/form/div[2]/input"));

        loginPasswordInput.sendKeys("password123");

        shortPause(2);

        WebElement loginButton = driver.findElement(
                org.openqa.selenium.By.xpath(
                        baseXpathAuth + "/app-login-form/form/div[3]/button[1]"));
        loginButton.click();
    }

    private void llenarFormularioRegistro() {

        wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.xpath(baseXpathAuth)));

        WebElement nombreInput = driver.findElement(
                org.openqa.selenium.By.xpath(
                        baseXpathAuth + "/app-register-form/form/div[1]/div[1]/input"));

        nombreInput.sendKeys("Juan");

        shortPause(2);

        WebElement apellidoInput = driver.findElement(
                org.openqa.selenium.By.xpath(
                        baseXpathAuth + "/app-register-form/form/div[1]/div[2]/input"));

        apellidoInput.sendKeys("Angarita");

        shortPause(2);

        WebElement emailInput = driver.findElement(
                org.openqa.selenium.By.xpath(
                        baseXpathAuth + "/app-register-form/form/div[1]/div[3]/input"));

        emailInput.sendKeys("juanang.com");

        shortPause(2);

        WebElement cedulaInput = driver.findElement(
                org.openqa.selenium.By.xpath(
                        baseXpathAuth + "/app-register-form/form/div[1]/div[4]/input"));

        cedulaInput.sendKeys("1234567890");

        shortPause(5);

        emailInput.clear();

        shortPause(2);
        emailInput.sendKeys("juanang@gmail.com");

        shortPause(2);

        WebElement telefonoInput = driver.findElement(
                org.openqa.selenium.By.xpath(
                        baseXpathAuth + "/app-register-form/form/div[1]/div[5]/input"));

        telefonoInput.sendKeys("0987654321");

        shortPause(2);

        WebElement passwordInput = driver.findElement(
                org.openqa.selenium.By.xpath(
                        baseXpathAuth + "/app-register-form/form/div[1]/div[7]/input"));

        passwordInput.sendKeys("password123");

        shortPause(2);

        WebElement submitButton = driver.findElement(
                org.openqa.selenium.By.xpath(
                        baseXpathAuth + "/app-register-form/form/div[2]/button[1]"));
        submitButton.click();

    }

    private void llenarFormularioReserva(String inicio, String fin) {
        wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.xpath(baseXpathReserva + "[1]")));

        shortPause(2);

        WebElement dateInputStart = driver.findElement(By.xpath(
                baseXpathReserva + "/div/div[1]/input"));
        dateInputStart.clear();
        dateInputStart.sendKeys(inicio);

        shortPause(2);

        WebElement dateInputEnd = driver.findElement(By.xpath(
                baseXpathReserva + "/div/div[2]/input"));
        dateInputEnd.clear();
        dateInputEnd.sendKeys(fin);

        shortPause(2);

        wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.xpath(
                        baseXpathReserva + "[2]/app-room-type-selector")));

        WebElement roomTypeGrid = driver.findElement(By.xpath(
                baseXpathReserva + "[2]/app-room-type-selector/div/div[2]"));

        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", roomTypeGrid);

        shortPause(2);

        WebElement roomTypeSelect = driver.findElement(By.xpath(
                baseXpathReserva + "[2]/app-room-type-selector/div/div[3]/div[1]"));

        roomTypeSelect.click();

        shortPause(2);

        wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.xpath(baseXpathReserva + "[3]/app-room-selector")));

        WebElement roomGrid = driver.findElement(By.xpath(
                baseXpathReserva + "[3]/app-room-selector/div"));

        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", roomGrid);

        shortPause(2);

        WebElement roomSelect = driver.findElement(By.xpath(
                baseXpathReserva + "[3]/app-room-selector/div/div[2]/div[1]"));
        roomSelect.click();

        wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.xpath(baseXpathReserva + "[4]")));

        shortPause(2);

        WebElement formAction = driver.findElement(By.xpath(
                baseXpathReserva + "[4]/div[2]"));

        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", formAction);

        shortPause(2);

        WebElement submitButton = driver.findElement(By.xpath(
                baseXpathReserva + "[4]/div[2]/button"));

        submitButton.click();

        shortPause(2);

        ((JavascriptExecutor) driver).executeScript("window.scrollTo(0, 0);");

    }
}
