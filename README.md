# meet-me (Web Programming Project)

~~Διαθέσιμο στο heroku [εδώ](https://meet--me.herokuapp.com/)~~

Διαθέσιμο [εδώ](https://library-network.babis-skeparnakos.com//)

## Τρέξιμο χρησιμοποιώντας μόνο docker:

To run for production:
```
cp .env.sample .env
docker compose up -d --build
docker compose -f docker-compose-nginx.yml up -d
```

To run for development:
```
cp .env.sample .env
chmod +x ./resetDb.sh
./resetDb.sh
docker compose -f docker-compose.dev.yml up --build
```

## Τρέξιμο χωρίς docker:

Για να εγκατασταθεί και να μπορεί να χρησιμοποιηθεί το πρόγραμμα πρέπει πρώτα να εκτελεστούν τα ακόλουθα βήματα:

- Να κατεβούν τα αρχεία από το github
- Να γίνει εγκατάσταση της node js (συγκεκριμένα έγινε χρήση της έκδοσης 14.16)
- Να γίνει εγκατάσταση του npm (αν δεν εγκατασταθεί μαζί με τη nodejs)
- Προαιρετικά μπορεί να γίνει εγκατάσταση του VS Code για διευκόλυνση και του nodemon
- Ανέβασμα και εκτέλεση του αρχείου [database.sql](./model/database.sql) σε κάποια υπηρεσία database hosting (μπορεί να γίνει και τοπικά) ώστε να γίνει δημιουργία βάσης
- Στο .env αρχείο πρέπει να δηλωθεί στο αρχείο η διεύθυνση επικοινωνίας με τη βάση στη μεταβλητή DATABASE_URL, προαιρετικά το port που θα τρέξει ο server στη μεταβλητή PORT και προαιρετικά το SESSION_SECRET που χρησιμοποιείται από το express-session για να κωδικοποιήσει τα cookies.
- Εκκίνηση του terminal στον φάκελο meet-me και εκτέλεση πρώτα της εντολής 'npm install' για την αυτόματη εγκατάσταση των node modules που χρησιμοποιούνται και στη συνέχεια εκτέλεση του start.js με την εντολή 'node start.js'.
- Επίσκεψη στην σελίδα localhost:port, όπου port είναι η διεύθυνση στην οποία μας τυπώνει το πρόγραμμα ότι τρέχει.


TODO:

- [ ] Μετάφραση σελίδας και του README στα αγγλικά
- [ ] Βελτίωση των url στο login σύστημα
- [ ] Διόρθωση στην έκδοση του node στο package.json ?
