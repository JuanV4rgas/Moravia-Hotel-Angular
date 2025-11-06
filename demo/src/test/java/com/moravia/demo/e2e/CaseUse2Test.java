package com.moravia.demo.e2e;

import java.time.Duration;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.By;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.Keys;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;

import io.github.bonigarcia.wdm.WebDriverManager;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("test")
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
public class CaseUse2Test {

        private final String baseUrl = "http://localhost:4200";
        private final String baseXpathAuth = "/html/body/app-root/app-auth-layout/app-auth-wrap/div/app-auth-card/div";
        private final String baseXpathReserva = "/html/body/app-root/app-portal-layout/app-reserva-form/div/form/div";
        private final String baseXpathMisReservas = "/html/body/app-root/app-portal-layout/app-mis-reservas";
        private final String baseXpathTablaReservas = "/html/body/app-root/app-portal-layout/app-reserva-table";
        private final String baseXpathGestionarServicios = "/html/body/app-root/app-portal-layout/app-gestionar-servicios";
        private final String baseXpathDetalleReserva = "/html/body/app-root/app-portal-layout/app-detalle-reserva";

        private WebDriver driver;
        private WebDriverWait wait;
        private WebDriver operatorDriver;
        private WebDriverWait operatorWait;

        @BeforeEach
        public void init() {
                WebDriverManager.chromedriver().setup();
                ChromeOptions chromeOptions = new ChromeOptions();
                chromeOptions.addArguments("--disable-extensions");
                chromeOptions.addArguments("--disable-notifications");
                // chromeOptions.addArguments("--headless");

                // Desactivar la autenticación de Chrome para que no salga el pop-up
                Map<String, Object> prefs = new HashMap<>();
                prefs.put("credentials_enable_service", false);
                prefs.put("profile.password_manager_enabled", false);
                prefs.put("profile.password_manager_leak_detection", false);

                chromeOptions.setExperimentalOption("prefs", prefs);

                // Driver para el usuario cliente
                this.driver = new ChromeDriver(chromeOptions);
                this.wait = new WebDriverWait(driver, Duration.ofSeconds(5));

                // Driver para el operador (en otra pestaña/ventana)
                this.operatorDriver = new ChromeDriver(chromeOptions);
                this.operatorWait = new WebDriverWait(operatorDriver, Duration.ofSeconds(5));
        }

        @Test
        public void testReservaCompleta_CheckinServiciosYCheckout() {

                /* ================ FLUJO DEL CLIENTE ==================== */
                /** Navegar a la página principal */
                this.driver.get(baseUrl + "/home");
                this.wait.until(ExpectedConditions
                                .visibilityOfElementLocated(By.xpath("/html/body/app-root/app-main-layout")));

                shortPause(2);

                /** Navegar a la página de autenticación y logearse */
                this.driver.get(baseUrl + "/auth");

                shortPause(2);

                llenarFormularioLogin("maria.gomez@example.com", "pass456", this.driver, this.wait);

                shortPause(2);

                /** Navegar a la página de reserva y realizar una nueva reserva */
                this.driver.get(baseUrl + "/reserva/nueva");
                shortPause(2);

                String inicioReserva = LocalDate.now().plusDays(-3).format(DateTimeFormatter.ofPattern("dd-MM-yyyy"));
                String finReserva = LocalDate.now().plusDays(10).format(DateTimeFormatter.ofPattern("dd-MM-yyyy"));

                llenarFormularioReserva(inicioReserva, finReserva, this.driver, this.wait);

                shortPause(2);

                /** Navegar a la página de mis reservas y obtener el id de la reserva */
                this.driver.get(baseUrl + "/mis-reservas");

                this.wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(baseXpathMisReservas)));
                shortPause(2);

                WebElement elemento = this.driver.findElement(
                                By.xpath(baseXpathMisReservas + "/div/div[2]/div[1]/div[1]/div[1]/h3"));
                String texto = elemento.getText(); // "Reserva #123"
                String idReserva = texto.split("#")[1]; // "123"

                /* ================ FLUJO DEL OPERADOR ==================== */
                /** Navegar a la página principal */
                this.operatorDriver.get(baseUrl + "/home");

                shortPause(2);

                /** Navegar a la página de autenticación y logearse */
                this.operatorDriver.get(baseUrl + "/auth");

                shortPause(2);

                llenarFormularioLogin("carlos.rojas@example.com", "carlos123", this.operatorDriver, this.operatorWait);

                shortPause(1);

                Actions actions = new Actions(this.operatorDriver);
                actions.sendKeys(Keys.ESCAPE).perform();
                shortPause(1);

                shortPause(2);

                /** Navegar a la tabla de reservas y activar la reserva */
                this.operatorDriver.get(baseUrl + "/reserva/table");
                this.operatorWait
                                .until(ExpectedConditions.visibilityOfElementLocated(By.xpath(baseXpathTablaReservas)));
                shortPause(2);

                WebElement reservaIdInput = this.operatorDriver
                                .findElement(By.xpath(baseXpathTablaReservas + "/main/div/div[2]/div[1]/div[2]/input"));
                reservaIdInput.clear();
                reservaIdInput.sendKeys(idReserva);

                shortPause(2);

                WebElement tablaReserva = this.operatorDriver
                                .findElement(By.xpath(baseXpathTablaReservas + "/main/div/div[3]/table/tbody"));
                ((JavascriptExecutor) this.operatorDriver).executeScript("arguments[0].scrollIntoView(true);",
                                tablaReserva);

                shortPause(1);

                WebElement botonActivar = this.operatorDriver.findElement(By
                                .xpath(baseXpathTablaReservas + "/main/div/div[3]/table/tbody/tr/td[7]/div/button[3]"));
                botonActivar.click();

                limpiarAlertasPendientes(this.operatorDriver, this.operatorWait);

                shortPause(2);

                /**
                 * Navegar a la página de gestión de servicios y añadir servicios a la
                 * reserva
                 */
                WebElement botonServicios = this.operatorDriver.findElement(By
                                .xpath(baseXpathTablaReservas + "/main/div/div[3]/table/tbody/tr/td[7]/div/button[2]"));
                botonServicios.click();

                this.operatorWait.until(
                                ExpectedConditions.presenceOfElementLocated(By.xpath(baseXpathGestionarServicios)));
                shortPause(1);

                WebElement serviciosGrid = this.operatorDriver
                                .findElement(By.xpath(baseXpathGestionarServicios + "/div/div[3]/div/div[1]"));
                ((JavascriptExecutor) this.operatorDriver).executeScript("arguments[0].scrollIntoView(true);",
                                serviciosGrid);

                shortPause(1);

                WebElement botonAgregarServicio1 = this.operatorDriver.findElement(
                                By.xpath(baseXpathGestionarServicios + "/div/div[3]/div/div[1]/div[3]/button"));
                this.operatorWait.until(ExpectedConditions.elementToBeClickable(botonAgregarServicio1));
                shortPause(1);
                ((JavascriptExecutor) this.operatorDriver).executeScript("arguments[0].click();",
                                botonAgregarServicio1);
                shortPause(1);
                ((JavascriptExecutor) this.operatorDriver).executeScript("window.scrollTo(0, 0);");

                shortPause(2);

                this.operatorWait.until(
                                ExpectedConditions.presenceOfElementLocated(By.xpath(baseXpathGestionarServicios)));
                shortPause(2);

                serviciosGrid = this.operatorDriver
                                .findElement(By.xpath(baseXpathGestionarServicios + "/div/div[3]/div/div[1]"));
                ((JavascriptExecutor) this.operatorDriver).executeScript("arguments[0].scrollIntoView(true);",
                                serviciosGrid);

                this.operatorWait.until(ExpectedConditions.presenceOfElementLocated(
                                By.xpath(baseXpathGestionarServicios + "/div/div[3]/div/div[2]/div[3]/button")));

                WebElement botonAgregarServicio2 = this.operatorDriver.findElement(
                                By.xpath(baseXpathGestionarServicios + "/div/div[3]/div/div[2]/div[3]/button"));
                this.operatorWait.until(ExpectedConditions.elementToBeClickable(botonAgregarServicio2));
                shortPause(1);
                ((JavascriptExecutor) this.operatorDriver).executeScript("arguments[0].click();",
                                botonAgregarServicio2);
                shortPause(1);
                ((JavascriptExecutor) this.operatorDriver).executeScript("window.scrollTo(0, 0);");

                /* ================ FLUJO DEL CLIENTE ==================== */
                /** Navegar a la página de mis reservas para ver los servicios y el total */
                this.driver.get(baseUrl + "/mis-reservas");
                this.wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath(baseXpathMisReservas)));
                shortPause(2);

                /* Navegar a la página de detalle de la reserva */
                this.driver.get(baseUrl + "/reserva/detalle/" + idReserva);
                shortPause(2);

                WebElement serviciosReserva = this.driver
                                .findElement(By.xpath(baseXpathDetalleReserva + "/div/div/div[2]/div[3]"));
                ((JavascriptExecutor) this.driver).executeScript("arguments[0].scrollIntoView(true);",
                                serviciosReserva);
                shortPause(4);

                WebElement totalReserva = this.driver
                                .findElement(By.xpath(baseXpathDetalleReserva + "/div/div/div[2]/div[4]"));
                ((JavascriptExecutor) this.driver).executeScript("arguments[0].scrollIntoView(true);", totalReserva);
                shortPause(4);

                /* ================ FLUJO DEL OPERADOR ==================== */
                /** Navegar a la página la tabla de reservas y hacer el chaeckout */
                this.operatorDriver.get(baseUrl + "/reserva/table");
                this.operatorWait
                                .until(ExpectedConditions.visibilityOfElementLocated(By.xpath(baseXpathTablaReservas)));
                shortPause(2);

                reservaIdInput = this.operatorDriver
                                .findElement(By.xpath(baseXpathTablaReservas + "/main/div/div[2]/div[1]/div[2]/input"));
                reservaIdInput.clear();
                reservaIdInput.sendKeys(idReserva);

                shortPause(2);

                tablaReserva = this.operatorDriver
                                .findElement(By.xpath(baseXpathTablaReservas + "/main/div/div[3]/table/tbody"));
                ((JavascriptExecutor) this.operatorDriver).executeScript("arguments[0].scrollIntoView(true);",
                                tablaReserva);
                shortPause(1);

                /* Hacer el pago de la reserva */
                WebElement botonPagar = this.operatorDriver.findElement(By
                                .xpath(baseXpathTablaReservas + "/main/div/div[3]/table/tbody/tr/td[7]/div/button[5]"));
                botonPagar.click();
                limpiarAlertasPendientes(this.operatorDriver, this.operatorWait);

                shortPause(2);

                /* Finalizar la reserva */
                WebElement botonFinalizar = this.operatorDriver.findElement(By
                                .xpath(baseXpathTablaReservas + "/main/div/div[3]/table/tbody/tr/td[7]/div/button[4]"));
                botonFinalizar.click();
                limpiarAlertasPendientes(this.operatorDriver, this.operatorWait);

                /* ================ FLUJO DEL CLIENTE ==================== */
                /*
                 * Navegar a la página de detalle de la reserva para ver el estaodo de la
                 * reserva
                 */
                this.driver.get(baseUrl + "/reserva/detalle/" + idReserva);
                shortPause(2);

                serviciosReserva = this.driver
                                .findElement(By.xpath(baseXpathDetalleReserva + "/div/div/div[2]/div[3]"));
                ((JavascriptExecutor) this.driver).executeScript("arguments[0].scrollIntoView(true);",
                                serviciosReserva);
                shortPause(4);

                totalReserva = this.driver.findElement(By.xpath(baseXpathDetalleReserva + "/div/div/div[2]/div[4]"));
                ((JavascriptExecutor) this.driver).executeScript("arguments[0].scrollIntoView(true);", totalReserva);
                shortPause(4);
        }

        private void limpiarAlertasPendientes(WebDriver driver, WebDriverWait wait) {
                int maxIntentos = 3;
                int intentos = 0;
                boolean alertHandled = false;
                while (intentos < maxIntentos) {
                        try {
                                WebDriverWait alertWait = new WebDriverWait(driver, Duration.ofSeconds(2));
                                alertWait.until(ExpectedConditions.alertIsPresent());
                                String alertText = driver.switchTo().alert().getText();
                                System.out.println("Limpiando alerta pendiente: " + alertText);
                                shortPause(3); // Delay to see the alert content
                                driver.switchTo().alert().accept();
                                intentos++;
                                alertHandled = true;
                                shortPause(1);
                        } catch (Exception e) {
                                // No hay más alertas pendientes
                                break;
                        }
                }
                // Intentar dismissar popups con ESC solo si no se manejaron alertas
                if (!alertHandled) {
                        try {
                                Actions actions = new Actions(driver);
                                actions.sendKeys(Keys.ESCAPE).perform();
                                shortPause(1);
                        } catch (Exception e) {
                                // Ignorar si no hay popup
                        }
                }
        }

        private void shortPause(int seconds) {
                try {
                        Thread.sleep(seconds * 1000L);
                } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                }
        }

        private void llenarFormularioReserva(String inicio, String fin, WebDriver driver, WebDriverWait wait) {
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

        private void llenarFormularioLogin(String email, String password, WebDriver driver, WebDriverWait wait) {

                wait.until(ExpectedConditions.visibilityOfElementLocated(
                                By.xpath(baseXpathAuth)));

                shortPause(2);

                WebElement loginEmailInput = driver.findElement(
                                org.openqa.selenium.By.xpath(
                                                baseXpathAuth + "/app-login-form/form/div[1]/input"));

                loginEmailInput.sendKeys(email);

                shortPause(2);

                WebElement loginPasswordInput = driver.findElement(
                                org.openqa.selenium.By.xpath(
                                                baseXpathAuth + "/app-login-form/form/div[2]/input"));

                loginPasswordInput.sendKeys(password);

                shortPause(2);

                WebElement loginButton = driver.findElement(
                                org.openqa.selenium.By.xpath(
                                                baseXpathAuth + "/app-login-form/form/div[3]/button[1]"));
                loginButton.click();
        }
}
