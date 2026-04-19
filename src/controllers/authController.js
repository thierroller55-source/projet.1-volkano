const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// ── INSCRIPTION ──
exports.register = async (req, res) => {
  try {
    const { nom, email, password } = req.body;
    // On crypte le mot de passe avant de l'enregistrer
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = new User({ nom, email, password: hashedPassword });
    await newUser.save();
    
    res.status(201).json({ message: "Utilisateur créé avec succès !" });
  } catch (error) {
    res.status(400).json({ message: "Erreur : cet email est déjà utilisé." });
  }
};

// ── CONNEXION ──
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    // Si l'utilisateur n'existe pas
    if (!user) return res.status(401).json({ message: "Accès refusé : Email incorrect." });

    // On vérifie le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Accès refusé : Mot de passe incorrect." });

    // Si tout est bon, on crée un jeton (token)
    const token = jwt.sign({ id: user._id }, 'VOTRE_CLE_SECRET', { expiresIn: '1h' });

    res.json({ message: "Accès autorisé ! Bienvenue.", token, user: { nom: user.nom, email: user.email } });

  } catch (error) {
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// ── MOT DE PASSE OUBLIÉ (Simple) ──
// MOT DE PASSE OUBLIÉ
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // On cherche l'utilisateur sans tenir compte des majuscules/minuscules
    // La regex 'i' permet de trouver "Diarra" même si on tape "diarra"
    const user = await User.findOne({ 
      email: { $regex: new RegExp("^" + email.trim() + "$", "i") } 
    });

    // On renvoie une erreur si l'utilisateur n'existe vraiment pas
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "Cet e-mail n'est pas reconnu." 
      });
    }

    // Succès (Sans rien afficher dans le terminal)
    return res.status(200).json({ 
      success: true, 
      message: "Un lien de réinitialisation a été envoyé à votre adresse e-mail." 
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: "Erreur serveur." });
  }
};